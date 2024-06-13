import axios from 'axios';
import * as dotenv from 'dotenv';

interface StructuredLead {
  id: number;
  lead_name: string;
  price: string;
  status: string;
  created_at: string;
  responsible_user: string;
  contacts: {
    name: string;
    phone: string;
    email: string;
  };
}

interface Lead {
  id: number;
  name: string;
  created_at: string;
  price: number;
  responsible_user_id: number;
  status_id: number;
  pipeline_id: number;
  _embedded: {
    contacts: {
      id: number;
    }[];
  };
}

dotenv.config();

class AmoCrmService {
  private readonly apiUrl = `https://${process.env.AMOCRM_DOMAIN}.amocrm.ru/api/v4`;
  private readonly headers = {
    'Authorization': `Bearer ${process.env.AMOCRM_DOLG_TOKEN}`,
    'Content-Type': 'application/json',
  };
  private userCache = new Map<number, any>();
  private contactCache = new Map<number, any>();
  private statusCache = new Map<string, any>();

  public async getLeads(query?: string) {
    try {
      let url = `${this.apiUrl}/leads?with=contacts`;

      if (query && query.length >= 3) {
        url += `&query=${query}`;
      }

      const response = await axios.get(url, { headers: this.headers });
      
      
      if(response.data._embedded.leads.length === 0) return []
      
      const leads = response.data._embedded.leads;

      const leadPromises = leads.map(async (lead: Lead) => {
        const contact = await this.getCachedContact(lead._embedded.contacts[0]?.id);
        const responsibleUser = await this.getCachedResponsibleUser(lead.responsible_user_id);
        const status = await this.getCachedStatus(lead.pipeline_id, lead.status_id);

        return {
          id: lead.id,
          lead_name: lead.name,
          price: lead.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }),
          status: status.name,
          created_at: new Date(lead.created_at).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          responsible_user: responsibleUser.name,
          contacts: {
            name: contact.name,
            phone: contact.phone,
            email: contact.email,
          },
        } as StructuredLead;
      });

      return await Promise.all(leadPromises);
    } catch (error) {
      throw new Error('Не удалось получить сделки из amoCRM');
    }
  }

  private async getCachedResponsibleUser(id: number) {
    if (!this.userCache.has(id)) {
      const response = await axios.get(`${this.apiUrl}/users/${id}`, { headers: this.headers });
      this.userCache.set(id, response.data);
    }
    return this.userCache.get(id);
  }

  private async getCachedContact(id?: number) {
    if (!id) return { name: "", phone: "", email: "" };
    if (!this.contactCache.has(id)) {
      const response = await axios.get(`${this.apiUrl}/contacts/${id}`, { headers: this.headers });
      const contact = {
        name: response.data.name || '',
        phone: '',
        email: '',
      };
      if (response.data.custom_fields_values) {
        response.data.custom_fields_values.forEach((field: any) => {
          if (field.field_name === 'Телефон') {
            contact.phone = field.values[0].value;
          }
          if (field.field_name === 'Email') {
            contact.email = field.values[0].value;
          }
        });
      }
      this.contactCache.set(id, contact);
    }
    return this.contactCache.get(id);
  }

  private async getCachedStatus(pipeline_id: number, status_id: number) {
    const key = `${pipeline_id}_${status_id}`;
    if (!this.statusCache.has(key)) {
      const response = await axios.get(`${this.apiUrl}/leads/pipelines/${pipeline_id}/statuses/${status_id}`, { headers: this.headers });
      this.statusCache.set(key, response.data);
    }
    return this.statusCache.get(key);
  }
}

export default new AmoCrmService();

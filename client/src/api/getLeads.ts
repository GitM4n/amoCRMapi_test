import { ref } from "vue"

export interface StructuredLead {
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

export const leads = ref<StructuredLead[]>([])
export const isLoading = ref(false)

export const getLeads = async(query?:string) => {
    try {
        let url = 'http://localhost:5000/api/leads'

        if (query) {
            url += `?query=${query}`;
          }

        isLoading.value = true
        const response = await fetch(url)
        leads.value = await response.json()
        
    } catch (error) {
        throw new Error(error as string)
    }finally{
        isLoading.value = false
    }
}
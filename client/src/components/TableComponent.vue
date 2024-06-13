

<script setup lang="ts">
import {ref} from 'vue'
import { VDataTable, VCard, VTextField } from 'vuetify/components';
import TableHeader from './TableHeader.vue';
import { onMounted } from 'vue';
import { getLeads, leads, isLoading } from '../api/getLeads';
import statusIndicator from './UI/statusIndicator.vue';
import loaderIndicator from './UI/loaderIndicator.vue';





const headers = ref<any[]>([
    {
        title:'Название',
        value:'lead_name',
    },
    {
        title:'Бюджет',
        value:'price',
    },
    {
        title:'Статус',
        value:'status',
    },
    {
        title:'Ответственный',
        value:'responsible_user',
    },
    {
        title:'Дата создания',
        value:'created_at',
    },

])


const toggleExpand = (event: Event) => {
    console.log(event)
}


const postQuery = async(item:boolean) =>{
    if(!item && search.value.length >= 3){
        await getLeads(search.value);
    }

    if(!item && search.value.length == 0){
        await getLeads();
    }
}

const search = ref('')


onMounted(async()=> {
    await getLeads();
})

</script>

<template>
    <div class="table-component" v-show="!isLoading">

      <TableHeader />
  
        <v-card>
            <template #text>
                <v-text-field
                  v-model.lazy="search"
                  label="Search (Запрос идет после расфокусировки поля)"
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  hide-details
                  single-line
                  @update:focused="postQuery"
                  
                ></v-text-field>
              </template>
            
            <v-data-table class="data-table" v-if="leads.length > 0"  item-selectable="selectable" :headers="headers" :items="leads" :expandOnClick="true" :hide-default-header="true"
            :hide-default-footer="true" @click="toggleExpand($event)">
            
                <template #headers="{headers}">
                    <tr>
                        <th v-for="header in headers[0]" style="font-weight:bold; font-size:large;" :key="header.title">
                            {{header.title}}
                        </th>
                    </tr>
                </template>

                <template #item.status="{ item }">
                    <statusIndicator :status="item.status"/>
                </template>
                <template #expanded-row="{ columns, item}">
                    <td :colspan="columns.length">
                    <tr class="expand-table" v-if="item.contacts.name || item.contacts.phone || item.contacts.email">
                        <td v-if="item.contacts.name">
                            <h5 class="label">Фамилия Имя</h5>
                            <span>{{item.contacts.name}}</span>
                        </td>
                        <td v-if="item.contacts.phone">
                            <h5 class="label">Телефон</h5>
                            <a :href="`tel:${item.contacts.phone}`">{{item.contacts.phone}}</a>
                        </td>
                        <td v-if="item.contacts.email">
                            <h5 class="label">Email</h5>
                            <a :href="`mailto:${item.contacts.email}`">{{item.contacts.email}}</a>
                        </td>
                    </tr>
                    <tr v-else class="expand-table">Нет данных</tr>
                    </td>
                </template>
            </v-data-table>
            <p class="no-data" v-else>Список пуст</p>
        </v-card>

    
    </div>

    <loaderIndicator class="loader" v-show="isLoading"/>
     
        
   
</template>

<style scoped>



.data-table{
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
   
}



.expand-table{
    font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
    display: flex;
    gap: 40px;
    padding: 10px 0 10px 30px;
}

.label{
    font-weight: bold;
}

a{
    text-decoration: none;
    color: #000;
}

.loader{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.no-data{
    text-align: center;
    font-weight: bold;
    font-size: 30px;
}

</style>
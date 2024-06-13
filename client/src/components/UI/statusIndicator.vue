<script setup lang="ts">
import {computed} from 'vue'

const props = defineProps({
    status: String
})



const setColor = computed(() => {
    switch (props.status) {
        case 'Первичный контакт':
            return '#74b6e8'
        case 'Переговоры':
            return '#fcf83f'
        case 'Принимают решение':
            return '#fba240'
        case 'Согласование договора':
            return '#fc6a6a'
        case 'Успешно реализовано':
            return '#3cfe4c'
        case 'Закрыто и не реализовано':
            return '#aaaaaa'
        default:
            return '#aaaaaa'
    }
})

</script>

<template>
    <div class="status-indicator" :style="{backgroundColor:setColor}">
        <div class="status-indicator__text">
            {{ props.status }}
        </div>
    </div>
</template>

<style scoped>

.status-indicator{
    padding: 0 10px;
    border-radius: 5px;
}

.status-indicator__text{
    font-weight: 600;
    text-align: center
}
</style>
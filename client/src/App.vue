<script setup lang="ts">
import TableComponent from './components/TableComponent.vue';
</script>

<template>
    <div class="wrapper">
        <main class="container">
            <TableComponent />
           </main>
    </div>
</template>

<style scoped>
.wrapper{
    min-height: 100vh;
   padding-top: 10%;
 
}

.container{
    max-width: 1600px;
    padding: 0 20px;
    margin: 0 auto;
   
    
}
</style>

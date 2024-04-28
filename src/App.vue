<template>
    <HeaderComponent />
    <div class="container">
        <BalanceComponent />
        <IncomeExpences />
        <TransactionList />
        <AddTransaction />

    </div>

</template>

<script type="module">

import HeaderComponent from "./components/HeaderComponent.vue"
import BalanceComponent from "./components/BalanceComponent.vue"
import IncomeExpences from "./components/IncomeExpences.vue"
import TransactionList from "./components/TransactionList.vue";
import AddTransaction from "./components/AddTransaction.vue";

export default {
    components: {
        HeaderComponent,
        BalanceComponent,
        IncomeExpences,
        TransactionList,
        AddTransaction

    },

}

</script>

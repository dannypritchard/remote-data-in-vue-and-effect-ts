<template>
  <p v-if="state._tag === 'NotAsked'">
    Click to load data
    <button @click="load">Load Data</button>
  </p>
  <p v-else-if="state._tag === 'Loading'">Loading...</p>
  <p v-else-if="state._tag === 'Success'">Data: {{ state.data }}</p>
  <p v-else-if="state._tag === 'Failure'">Error: {{ state.error }}</p>
</template>

<script setup lang="ts">
import { useRemoteDataEffect } from './composables/remoteData'

const { load, state } = useRemoteDataEffect(() => fetch('https://asdfasdf.typicode.com/todos/1'))
</script>

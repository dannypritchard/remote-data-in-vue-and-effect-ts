<template>
    <p v-if="state._tag === 'NotAsked'">
        Click to load data
        <button @click="load">Load Data</button>
    </p>
    <p v-else-if="state._tag === 'Loading'">Loading...</p>
    <div v-else-if="state._tag === 'Success'">
        Data:
        <pre>{{ state.data }}</pre>
    </div>
    <div v-else-if="state._tag === 'Failure'">
        Error:
        <pre>{{ state.error }}</pre>
    </div>

    <p v-if="['Success', 'Failure'].includes(state._tag)">
        <button @click="load">Reload Data</button>
    </p>
</template>

<script setup lang="ts">
import { Schema } from 'effect';

const UserSchema = Schema.Struct({
    userId: Schema.Number,
    id: Schema.Number,
    title: Schema.String,
    completed: Schema.Boolean,
});

import { useRemoteDataEffect } from './composables/remoteData';

const { load, state } = useRemoteDataEffect(
    () => fetch('https://jsonplaceholder.typicode.com/todos'),
    Schema.Array(UserSchema),
);
</script>

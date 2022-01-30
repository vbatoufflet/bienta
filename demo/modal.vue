<template>
    <div>
        <b-flex align="center" gap="1rem">
            <b-button @click="bienta.closeModal('heads')">Heads</b-button>
            <b-button @click="bienta.closeModal('tails')">Tails</b-button>
            <b-button type="danger" @click="bienta.closeModal(undefined, true)">Cancel</b-button>
        </b-flex>
    </div>
</template>

<script lang="ts" setup>
import {useBienta} from "~src/inject";

const bienta = useBienta();
</script>

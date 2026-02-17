<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      padding: 16px;
      height: 100%;
      overflow: auto;
      background: #ccc;
    "
  >
    <h3
      v-if="packageName"
      style="position: sticky; top: 8px; padding: 6px; background: #ccc"
    >
      {{ packageName }}
    </h3>
    <ul>
      <li
        v-for="fn in functions"
        :key="fn.id"
        @click="emit('selectFunction', fn.id)"
        style="cursor: pointer; color: rgb(12, 15, 213)"
      >
        {{ fn.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";
import { api } from "../api/client";

const props = defineProps<{
  packageName: string | null;
}>();

const emit = defineEmits<{
  (e: "selectFunction", id: string): void;
}>();

const functions = ref<any[]>([]);

watch(
  () => props.packageName,
  async (newPkg) => {
    if (!newPkg) return;

    const res = await api.get(
      `/packages/${encodeURIComponent(newPkg)}/functions`,
    );
    functions.value = res.data;
  },
);
</script>

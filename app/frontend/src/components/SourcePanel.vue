<template>
  <div
    style="
      padding: 12px;
      height: 100%;
      overflow: auto;
      background: #0f172a;
      color: #e2e8f0;
      font-family: monospace;
      font-size: 12px;
    "
  >
    <div v-if="source">
      <div
        v-for="(line, index) in source.split('\n')"
        :data-line="index + 1"
        :key="index"
        :style="{
          background:
            startLine &&
            endLine &&
            index + 1 >= startLine &&
            index + 1 <= endLine
              ? 'rgba(34,197,94,0.2)'
              : 'transparent',
        }"
      >
        <span style="color: #64748b; margin-right: 8px">
          {{ index + 1 }}
        </span>
        {{ line }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
import { api } from "../api/client";

const props = defineProps<{
  functionId: string | null;
}>();

const source = ref<string>("");
const startLine = ref<number | null>(null);
const endLine = ref<number | null>(null);

watch(
  () => props.functionId,
  async (id) => {
    if (!id) {
      source.value = "";
      return;
    }

    const res = await api.get(`/function/${encodeURIComponent(id)}/source`);
    source.value = res.data.content;
    startLine.value = res.data.startLine;
    endLine.value = res.data.endLine;

    nextTick(() => {
      if (startLine.value) {
        const el = document.querySelector(`[data-line="${startLine.value}"]`);
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  },
  { immediate: true },
);
</script>

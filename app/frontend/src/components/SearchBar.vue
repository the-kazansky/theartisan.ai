<template>
  <div
    ref="wrapper"
    style="position: relative; padding: 8px"
  >
    <input
      v-model="query"
      placeholder="Search function..."
      style="width: 100%; padding: 6px"
      @input="isInputFocused = true"
      @blur="isInputFocused = false"
    />

    <div
      v-if="results.length"
      style="
        position: absolute;
        top: 36px;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        max-height: 300px;
        overflow-y: auto;
        z-index: 10;
      "
    >
      <div
        v-for="r in results"
        :key="r.id"
        @click="
          emit('selectFunction', r.id);
          results = [];
          query = '';
        "
        style="padding: 6px; cursor: pointer"
      >
        <strong v-html="highlight(r.name, query)"></strong>
        <div style="font-size: 12px; color: #666">
          {{ r.package }}
        </div>
      </div>
    </div>

    <div
      v-if="loading"
      style="
        position: absolute;
        top: 36px;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        max-height: 300px;
        overflow-y: auto;
        z-index: 9;
      "
    >
      <div style="padding: 6px">Loading...</div>
    </div>

    <div
      v-else-if="isShowEmptyResults"
      style="
        position: absolute;
        top: 36px;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        max-height: 300px;
        overflow-y: auto;
        z-index: 8;
      "
    >
      <div style="padding: 6px">No results</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from "vue";
import { ref, watch } from "vue";
import { api } from "../api/client";

const emit = defineEmits<{
  (e: "selectFunction", id: string): void;
}>();

const query = ref("");
const results = ref<any[]>([]);
const loading = ref(false);
const wrapper = ref<HTMLElement | null>(null);

const isInputFocused = ref(false);

const isShowEmptyResults = computed(() => {
  return (
    !results.value.length &&
    !loading.value &&
    query.value &&
    isInputFocused.value
  );
});

function highlight(text: string, q: string) {
  if (!q) return text;

  const regex = new RegExp(`(${q})`, "ig");
  return text.replace(regex, "<mark>$1</mark>");
}

function handleClickOutside(event: MouseEvent) {
  if (!wrapper.value) return;

  if (!wrapper.value.contains(event.target as Node)) {
    results.value = [];
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

let timeout: number | null = null;

watch(query, (q) => {
  if (timeout) clearTimeout(timeout);

  if (q.length < 2) {
    results.value = [];
    return;
  }

  timeout = setTimeout(async () => {
    loading.value = true;
    const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
    results.value = res.data;
    loading.value = false;
  }, 300);
});
</script>

<style>
mark {
  background: #fde047;
  padding: 0 2px;
}
</style>

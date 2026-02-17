<template>
  <div
    style="
      display: flex;
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    "
  >
    <div style="flex: 0 0 auto">
      <SearchBar @selectFunction="openFunction" />
    </div>

    <div style="flex: 1; display: flex; overflow: hidden; height: 100%">
      <div style="flex: 2">
        <CallGraph
          v-if="selectedFunction"
          :key="selectedFunction"
          :functionId="selectedFunction"
          @back="handleBack"
        />

        <PackageGraph
          v-else
          key="package-graph"
          @select="selectedPackage = $event"
        />
      </div>

      <div style="flex: 1">
        <FunctionPanel
          :packageName="selectedPackage"
          @selectFunction="selectedFunction = $event"
        />
      </div>

      <div style="flex: 1">
        <SourcePanel :functionId="selectedFunction" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import PackageGraph from "../components/PackageGraph.vue";
import FunctionPanel from "../components/FunctionPanel.vue";
import CallGraph from "../components/CallGraph.vue";
import SourcePanel from "../components/SourcePanel.vue";
import SearchBar from "../components/SearchBar.vue";

const selectedPackage = ref<string | null>(null);
const selectedFunction = ref<string | null>(null);

function handleBack() {
  selectedFunction.value = null;
}

function openFunction(id: string) {
  selectedFunction.value = id;
}
</script>

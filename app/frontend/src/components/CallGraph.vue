<template>
  <div style="height: 100%">
    <div
      ref="container"
      style="width: 100%; height: 95%"
    ></div>
    <div>
      <button
        @click="emit('back')"
        style="margin: 8px"
      >
        ← Back to Packages
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import cytoscape from "cytoscape";
import { api } from "../api/client";

const props = defineProps<{
  functionId: string;
}>();

const emit = defineEmits<{
  (e: "back"): void;
}>();

const container = ref<HTMLDivElement | null>(null);

let cse: cytoscape.Core;

async function loadGraph(id: string) {
  const res = await api.get(`/function/${encodeURIComponent(id)}/neighborhood`);
  const { nodes, edges } = res.data;

  const elements = [
    ...nodes.map((n: any) => ({
      data: {
        id: n.id,
        label: n.label,
        type: n.type,
        complexity: n.complexity || 1,
      },
    })),
    ...edges.map((e: any) => ({
      data: {
        id: `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
      },
    })),
  ];

  if (cse) {
    cse.destroy();
  }

  cse = cytoscape({
    container: container.value!,
    elements,
    style: [
      {
        selector: "node",
        style: {
          label: "data(label)",
          width: (element: any) => {
            const c = element.data("complexity") || 1;
            return 30 + Math.min(c, 20) * 2;
          },
          height: (element: any) => {
            const c = element.data("complexity") || 1;
            return 30 + Math.min(c, 20) * 2;
          },
          "background-color": (element: any) =>
            element.data("type") === "root"
              ? "#16a34a"
              : element.data("type") === "caller"
                ? "#f59e0b"
                : "#3b82f6",
          color: "#000",
          "font-size": 10,
        },
      },
      {
        selector: "edge",
        style: {
          "line-color": "#94a3b8",
          width: 2,
        },
      },
    ],
    layout: {
      name: "cose",
      animate: true,
      idealEdgeLength: 120,
      nodeRepulsion: 400000,
    },
  });

  cse.on("tap", "node", (event) => {
    if (!event.target.data("type")) return;

    const newId = event.target.id();
    loadGraph(newId);
  });
}

onMounted(() => loadGraph(props.functionId));
watch(() => props.functionId, loadGraph);
</script>

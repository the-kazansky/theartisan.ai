<template>
  <div
    ref="container"
    style="width: 100%; height: 100%; overflow: auto"
  ></div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import cytoscape from "cytoscape";
import { api } from "../api/client";

const emit = defineEmits<{
  (e: "select", pkg: string): void;
}>();

const container = ref<HTMLDivElement | null>(null);

let cse: cytoscape.Core | null = null;

onMounted(async () => {
  const res = await api.get("/packages");
  const data = res.data;

  const elements = [];

  const nodes = new Set<string>();

  for (const edge of data) {
    if (!nodes.has(edge.source)) {
      elements.push({
        data: { id: edge.source, label: edge.source },
      });
      nodes.add(edge.source);
    }

    if (!nodes.has(edge.target)) {
      elements.push({
        data: { id: edge.target, label: edge.target },
      });
      nodes.add(edge.target);
    }

    elements.push({
      data: {
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target,
        weight: edge.weight,
      },
    });
  }

  cse = cytoscape({
    container: container.value!,
    elements,
    style: [
      {
        selector: "node",
        style: {
          label: "data(label)",
          "font-size": 8,
          "background-color": "#4f46e5",
          color: "#000",
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
    const node = event.target;
    emit("select", node.id());
  });
});

onBeforeUnmount(() => {
  cse?.destroy();
});
</script>

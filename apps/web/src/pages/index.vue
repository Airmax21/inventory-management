<script setup lang="ts">
import { definePage } from 'vue-router/auto';

definePage({
  meta: {
    requiresAuth: true,
  },
});
</script>
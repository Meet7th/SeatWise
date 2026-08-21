<template>
  <div class="space-y-4">
    <p class="text-lg font-medium text-gray-900">{{ question.question }}</p>
    <p v-if="question.description" class="text-sm text-gray-500">{{ question.description }}</p>
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索同学姓名..."
        class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
      <div v-if="searchQuery && filteredStudents.length > 0" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-auto">
        <button
          v-for="student in filteredStudents"
          :key="student.id"
          @click="addStudent(student)"
          class="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
        >
          <span>{{ student.name }}</span>
          <span v-if="selectedStudents.some(s => s.id === student.id)" class="text-primary-500">已选</span>
        </button>
      </div>
    </div>
    <div v-if="selectedStudents.length > 0" class="flex flex-wrap gap-2">
      <span
        v-for="student in selectedStudents"
        :key="student.id"
        class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
      >
        {{ student.name }}
        <button @click="removeStudent(student.id)" class="hover:text-primary-900">&times;</button>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Student {
  id: string;
  name: string;
}

const props = defineProps<{
  question: { id: string; question: string; description: string | null };
  modelValue: Student[];
  classmates?: Student[];
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Student[]];
}>();

const searchQuery = ref('');
const classmates = computed(() => props.classmates || []);

const filteredStudents = computed(() => {
  if (!searchQuery.value) return classmates.value;
  const q = searchQuery.value.toLowerCase();
  return classmates.value.filter(s =>
    s.name.toLowerCase().includes(q) && !selectedStudents.value.some(sel => sel.id === s.id)
  );
});

const selectedStudents = computed(() => props.modelValue || []);

function addStudent(student: Student) {
  if (selectedStudents.value.some(s => s.id === student.id)) return;
  if (selectedStudents.value.length >= 3) return;
  emit('update:modelValue', [...selectedStudents.value, student]);
  searchQuery.value = '';
}

function removeStudent(id: string) {
  emit('update:modelValue', selectedStudents.value.filter(s => s.id !== id));
}
</script>

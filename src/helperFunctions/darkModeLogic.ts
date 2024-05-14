import type { Ref } from 'vue';
import { ref } from 'vue';

export const isDarkMode: Ref<boolean> = ref(false);

export const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('darkModePreference', JSON.stringify(isDarkMode.value));
};

export const loadDarkModePreference = () => {
    const darkModePreference = localStorage.getItem('darkModePreference');
    if (darkModePreference !== null) {
        isDarkMode.value = JSON.parse(darkModePreference);
    }
};

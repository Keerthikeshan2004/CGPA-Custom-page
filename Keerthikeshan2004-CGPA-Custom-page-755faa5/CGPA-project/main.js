
const subjects = {
  open: [
    { name: "Image Processing", code: "IP101", credit: 4, type: "open" },
    { name: "Data Structures and Algorithms", code: "DSA202", credit: 3, type: "open" },
    { name: "Machine Learning", code: "ML303", credit: 4, type: "open" },
    { name: "Computer Networks", code: "CN404", credit: 3, type: "open" },
    { name: "Database Systems", code: "DB505", credit: 4, type: "open" }
  ],
  program: [
    { name: "Advanced Algorithms", code: "AA501", credit: 4, type: "program" },
    { name: "Computer Architecture", code: "CA602", credit: 3, type: "program" },
    { name: "Deep Learning", code: "DL703", credit: 4, type: "program" },
    { name: "Network Security", code: "NS804", credit: 3, type: "program" },
    { name: "Distributed Systems", code: "DS905", credit: 4, type: "program" }
  ]
};

const searchInput = document.getElementById('subject-search');
const suggestionsContainer = document.getElementById('suggestions');
const selectedSubjectsContainer = document.getElementById('selected-subjects');
const electiveTypeRadios = document.querySelectorAll('input[name="elective"]');

let selectedSubjects = [];
let currentElectiveType = 'open'; // Default to open elective

// Listen for elective type changes
electiveTypeRadios.forEach(radio => {
  radio.addEventListener('change', (e) => {
    currentElectiveType = e.target.value;
    // Clear current search when elective type changes
    searchInput.value = '';
    suggestionsContainer.style.display = 'none';
  });
});

// Back button functionality
document.querySelector('.back-button').addEventListener('click', () => {
  window.history.back();
});

// Search functionality
searchInput.addEventListener('input', (e) => {
  const searchTerm = e.target.value.toLowerCase();

  if (searchTerm.length === 0) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  // Determine which subjects to search based on current elective type
  let subjectsToSearch = [];
  if (currentElectiveType === 'open') {
    subjectsToSearch = subjects.open;
  } else if (currentElectiveType === 'program') {
    subjectsToSearch = subjects.program;
  } else { // 'both'
    subjectsToSearch = [...subjects.open, ...subjects.program];
  }

  // Filter subjects
  const filteredSubjects = subjectsToSearch.filter(subject =>
    (subject.name.toLowerCase().includes(searchTerm) ||
      subject.code.toLowerCase().includes(searchTerm)) &&
    !selectedSubjects.some(selected => selected.code === subject.code)
  );

  if (filteredSubjects.length > 0) {
    suggestionsContainer.innerHTML = '';
    filteredSubjects.forEach(subject => {
      const suggestionItem = document.createElement('div');
      suggestionItem.className = 'suggestion-item';
      suggestionItem.textContent = `${subject.name} (${subject.code}) - ${subject.credit} credits (${subject.type === 'open' ? 'Open' : 'Program'} Elective)`;
      suggestionItem.addEventListener('click', () => {
        if (!selectedSubjects.some(s => s.code === subject.code)) {
          selectedSubjects.push(subject);
          renderSelectedSubjects();
        }
        suggestionsContainer.style.display = 'none';
        searchInput.value = '';
      });
      suggestionsContainer.appendChild(suggestionItem);
    });
    suggestionsContainer.style.display = 'block';
  } else {
    suggestionsContainer.style.display = 'none';
  }
});

// Render selected subjects
function renderSelectedSubjects() {
  selectedSubjectsContainer.innerHTML = '';

  if (selectedSubjects.length === 0) {
    return;
  }

  const title = document.createElement('h3');
  title.textContent = 'Selected Subjects';
  selectedSubjectsContainer.appendChild(title);

  selectedSubjects.forEach((subject, index) => {
    const subjectElement = document.createElement('div');
    subjectElement.className = 'selected-subject';

    const subjectInfo = document.createElement('span');
    subjectInfo.textContent = `${subject.name} (${subject.code}) - ${subject.credit} credits (${subject.type === 'open' ? 'Open' : 'Program'} Elective)`;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove-subject';
    removeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
    removeButton.addEventListener('click', () => {
      selectedSubjects.splice(index, 1);
      renderSelectedSubjects();
    });

    subjectElement.appendChild(subjectInfo);
    subjectElement.appendChild(removeButton);
    selectedSubjectsContainer.appendChild(subjectElement);
  });
}

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (e.target !== searchInput) {
    suggestionsContainer.style.display = 'none';
  }
});

// Confirm button click handler
document.getElementById('confirm-button').addEventListener('click', () => {
  if (selectedSubjects.length === 0) {
    alert('Please select at least one subject');
    return;
  }

  localStorage.setItem('selectedSubjects', JSON.stringify(selectedSubjects));
  localStorage.setItem('lastUpdated', Date.now().toString());

  window.location.href = 'page1.html';
});

// Load any previously selected subjects
document.addEventListener('DOMContentLoaded', function () {
  const savedSubjects = localStorage.getItem('selectedSubjects');
  if (savedSubjects) {
    selectedSubjects = JSON.parse(savedSubjects);
    renderSelectedSubjects();
  }
});

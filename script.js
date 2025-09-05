const createElements = (array) => {
  const htmlElements = array.map((element) => `<span class="btn">${element}</span>`)
  return htmlElements.join(" ");
};

const loadingSpinner = (status) => {
  if(status === true){
    document.getElementById('spinner').classList.remove('hidden');
    document.getElementById('word-container').classList.add('hidden');
  }else{
    document.getElementById('word-container').classList.remove('hidden');
    document.getElementById('spinner').classList.add('hidden');
  }
};

const loadLessons = () => {
  loadingSpinner(true); 
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((json) => displayLessons(json.data))
    .finally(() => loadingSpinner(false)); 
};

const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
}

const loadLevelWord = (id) => {
  loadingSpinner(true); 
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => {
      removeActive()
      const clickBtn = document.getElementById(`lesson-btn-${id}`);
      clickBtn.classList.add("active")
      displayLevelWord(json.data)
    })
    .catch((err) => console.error(err))
    .finally(() => loadingSpinner(false)); 
};

const displayLessons = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
      <button id="lesson-btn-${lesson.level_no}" 
              onclick="loadLevelWord(${lesson.level_no})" 
              class="btn btn-outline btn-primary lesson-btn">
        <i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}
      </button>
    `;
    levelContainer.append(btnDiv)
  }
};
loadLessons();

const loadWordDetail = (id) => {
  loadingSpinner(true); 
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((json) => displayDetailWord(json.data))
    .catch((err) => console.error(err))
    .finally(() => loadingSpinner(false)); // spinner hide
};

const displayDetailWord = (word) => {
  const detailsContainer = document.getElementById("details-container");
  detailsContainer.innerHTML = `
  <div class="">
        <h2 class="text-2xl font-bold">${word.word} ( <i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})</h2>
      </div>
      <div class="">
        <h2 class="font-semibold">Meaning</h2>
        <p class="text-[14px] font-medium">${word.meaning}</p>
      </div>
            <div class="">
        <h2 class="font-semibold">Example</h2>
        <p class="text-[14px] ">${word.sentence}</p>
      </div>
            <div class="">
        <h2 class="font-semibold">সমার্থক শব্দ গুলো</h2>
        <div
        <div class="">${createElements(word.synonyms)}</div>
      </div>
  `
  document.getElementById("my_modal_5").showModal()
};

const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if(words.length === 0){
      wordContainer.innerHTML = `
      <div class=" text-center col-span-full py-10 space-y-6 font-bangla">
      <img class="mx-auto" src="./assets/alert-error.png" alt="">
        <p class="text-gray-500 text-[14px]">
          এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
        </p>
        <h2 class="text-2xl font-semibold">
         নেক্সট Lesson এ যান
        </h2>
      </div>`;
      return;
    }

    words.forEach((word) => {
        const card = document.createElement("div");
        card.innerHTML = `
              <div class=" bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-5">
        <h2 class="font-bold text-2xl">${word.word ? word.word : "পাওয়া যায়নি"}</h2>
        <p class="font-semibold">Meaning /Pronounciation</p>

        <div class="font-bangla text-2xl">"${word.meaning ? word.meaning : "পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "পাওয়া যায়নি"}"</div>

        <div class="flex items-center justify-between">
          <button onclick="loadWordDetail(${word.id})" class="btn bg-[#cfe8ff] text-[#374957] hover:bg-[#9bc4e8]"><i class="fa-solid fa-circle-info"></i></button>
          <button class="btn bg-[#cfe8ff] text-[#374957] hover:bg-[#9bc4e8]"><i class="fa-solid fa-volume-high"></i></button>
        </div>
      </div>`;
        wordContainer.append(card);
    });
}

// Step-8
function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
}

// Step-7.0
const createElements = (arr) => {
    const htmlElements = arr.map(el => `<span class="btn bg-blue-50 gap-1">${el}</span>`);
    return (htmlElements.join(" "));
}

// Step-9
const manageSpinner = (status) => {
    if (status == true) {
        document.getElementById("spinner").classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        document.getElementById("word-container").classList.remove("hidden");
        document.getElementById("spinner").classList.add("hidden");
    }
}

// Work Start Step-1
const loadLessons = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    fetch(url)
        .then(res => res.json())
        .then(json => displayLessons(json.data));
};

// Step-7.1
const removeActive = () => {
    const lessonButtons = document.querySelectorAll(".lesson-btn");
    // console.log(lessonButtons);
    lessonButtons.forEach((btn) => btn.classList.remove("btn-active"));
};

// Step-3
const loadLevelWord = (id) => {
    manageSpinner(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            removeActive(); // remove all active class
            const clickBtn = document.getElementById(`lesson-btn-${id}`);
            clickBtn.classList.add("btn-active"); // add active class
            displayLevelWord(data.data);
        });
};

// Step-5
const loadWordDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    const res = await fetch(url);
    const details = await res.json();
    displayWordDetails(details.data);
};

// Step-6/7
const displayWordDetails = (word) => {
    const detailsBox = document.getElementById("details-container");
    detailsBox.innerHTML = `
    <div class="">
                        <h2 class="text-2xl font-bold">
                            ${word.word} (<i class="fa-solid fa-microphone-lines"></i> : ${word.pronunciation})
                        </h2>
                    </div>
                    <div class="">
                        <h2 class="font-bold">Meaning</h2>
                        <p>${word.meaning}</p>
                    </div>
                    <div>
                        <h2 class="font-bold">Example</h2>
                        <p>${word.sentence}</p>
                    </div>
                    <div class="">
                        <h2 class="font-bold">সমার্থক শব্দ গুলো</h2>
                        <div class="">${createElements(word.synonyms)}</div>
                    </div>
                </div>

                <div class="modal-action">
                        <form method="dialog">
                            <!-- if there is a button in form, it will close the modal -->
                            <button class="btn btn-primary">Complete Learning</button>
                        </form>
                    </div>
    `;
    document.getElementById("word_modal").showModal();
}

// Step-4
const displayLevelWord = (words) => {
    const wordContainer = document.getElementById("word-container");
    wordContainer.innerHTML = "";

    if (words.length == 0) {
        wordContainer.innerHTML = `
        <div class="w-11/12 mx-auto rounded-2xl font-bangla text-center py-10 space-y-4 col-span-full ">
        <img class="mx-auto" src="./assets/alert-error.png"/>
                <p>এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="text-3xl font-semibold md:text-4xl">নেক্সট Lesson এ যান</h2>
        </div>
        `;
        manageSpinner(false);
        return;
    }


    words.forEach(word => {
        const wordCard = document.createElement("div");
        wordCard.innerHTML = `

        <div class="bg-white rounded-xl shadow-sm text-center py-8 px-5 space-y-4">
                <h2 class="font-bold text-2xl">${word.word ? word.word : "শব্দ পাওয়া যায়নি"}</h2>
                <p class="font-semibold">Meaning /Pronounciation</p>
                <div class="text-2xl font-medium font-bangla">${word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"} / ${word.pronunciation ? word.pronunciation : "Pronunciation পাওয়া যায়নি"}</div>
                <div class="flex justify-between items-center">
                    <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-circle-exclamation"></i></button>
                    <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80]"><i class="fa-solid fa-volume-high"></i></button>
                </div>
            </div>
        `;
        wordContainer.append(wordCard);
    });
    manageSpinner(false);
}

// Step-2
const displayLessons = (lessons) => {
    // 1. get the container & empty
    const levelContainer = document.getElementById("level-container");
    levelContainer.innerHTML = "";

    // 2. get into every lessons
    for (let lesson of lessons) {
        // 3. create element
        console.log(lesson);
        const btnDiv = document.createElement("div");
        btnDiv.innerHTML = `
                        <button id="lesson-btn-${lesson.level_no}" onclick="loadLevelWord(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-solid fa-book-open"></i>Lesson - ${lesson.level_no}</button>
        `;

        // 4. append into container
        levelContainer.append(btnDiv);
    };
};

// Step-10
document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    const input = document.getElementById("input-search");
    const searchValue = input.value.trim().toLowerCase();

    fetch("https://openapi.programming-hero.com/api/words/all")
        .then(res => res.json())
        .then(data => {
            const allWords = data.data;
            const filterWords = allWords.filter(word => word.word.toLowerCase().includes(searchValue));
            displayLevelWord(filterWords)
        });
});

// Step-11
document.getElementById("level-container")
    .addEventListener("click", () => {
        removeActive();
        const footerContainer = document.getElementById("footer");
        footerContainer.innerHTML = "";
        const addFooter = document.createElement("div");
        addFooter.innerHTML = `
        <section class="w-11/12 mx-auto space-y-5 md:flex justify-between mb-20">
        <div class="space-y-2">
            <h2 class="flex gap-1"><span class="text-2xl font-semibold">English</span><img src="./assets/logo.png"
            alt=""><span class="font-bangla text-2xl font-medium">জানালা</span>
            </h2>
            <p class="text-2xl font-medium font-bangla">ইংরেজি শিখুন সহজে</p>
            <p class="text-lg">Providing ED-Tech Applications since 2025</p>
            </div>
            
            <div class="">
            <p class="text-xl text-gray-500 font-medium ">Follow us</p>
            <div class="flex gap-3 text-2xl">
            <a href=""><i class="fa-brands fa-facebook"></i></a>
            <a href=""><i class="fa-brands fa-youtube"></i></a>
            <a href=""><i class="fa-brands fa-instagram"></i></a>
            <a href="https://github.com/takebul/english-janala"><i class="fa-brands fa-github"></i></a>
            </div>
            </div>
        </section>
            `;
        footerContainer.append(addFooter);
    });

loadLessons();

footerContainer();
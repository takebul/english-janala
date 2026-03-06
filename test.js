const createElement = (arr) => {
    const htmlElements = arr.map(el => `<span class="btn bg-blue-50">${el}</span>`);
    console.log(htmlElements.join(" "));
}

const synonyms = ["hello", "hi", "konnichiwa"];
createElement(synonyms)
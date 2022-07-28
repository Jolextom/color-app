const addBtn = document.querySelector(".add-btn");
const randomBtn = document.querySelector(".random-btn");
const delBtn = document.querySelector(".del-btn");
const colors = document.querySelector(".colors");
const guide = document.querySelector(".guide");
const hex = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
];

let maximum = false;

const dateID = () => {
  return new Date().getTime().toString();
};
const generateRandom = () => {
  return Math.floor(Math.random() * hex.length);
};
const hexColor = () => {
  let hexColor = "#";
  for (let num = 0; num < 6; num++) {
    hexColor += hex[generateRandom()];
  }
  return hexColor;
};

class UI {
  constructor() {}

  static createColor() {
    let id = dateID();
    let hex = hexColor();
    const color = { id, hex };
    guide.style.display = "none";
    UI.displayColor(color);
    if (!maximum) {
      Storage.createLocalColor(id, hex);
      console.log(colors.children.length);
    }
  }
  static displayColor(color) {
    if (colors.children.length < 6) {
      const div = document.createElement("div");
      div.classList.add("color");
      const attr = document.createAttribute("data-id");
      div.setAttributeNode(attr);
      attr.value = color.id;
      div.innerHTML = `
      <div class="color-bar" style="background-color:${color.hex}"></div>
      <div class="color-info">
        <div>
          <h3>hex</h3>
          <br />
          <span>${color.hex}</span>
        </div>
        <button class="btn btn-delete">remove</button>
      </div>
      `;
      colors.appendChild(div);

      div
        .querySelector(".btn-delete")
        .addEventListener("click", (e) => UI.deleteColor(e.target));

      UI.displayAlert("Color Added Successfully", "success");
    } else {
      maximum = true;
      UI.displayAlert("Maximum Reached", "danger");
    }
  }

  static changeColor(color) {
    let id = color.parentElement.dataset.id;
    let hex = hexColor();
    color.style.backgroundColor = hex;
    color.nextElementSibling.children[0].children[2].textContent = hex;

    Storage.editLocalColor(id, hex);
  }
  static shuffleColor() {
    if (colors.children.length > 0) {
      document.querySelectorAll(".color .color-bar").forEach((item) => {
        UI.changeColor(item);
      });
    }
  }
  static deleteColor(color) {
    let id = color.parentElement.parentElement.dataset.id;
    color.parentElement.parentElement.remove();
    Storage.removeLocalColor(id);

    if (colors.children.length < 1) {
      guide.style.display = "block";
      UI.displayAlert("All Color Deleted", "danger");
    } else {
      UI.displayAlert("Color Deleted", "danger");
    }
  }

  static displayAlert(text, action) {
    const alert = document.querySelector(".alert");
    alert.textContent = text;
    alert.classList.add(action);
    setTimeout(() => {
      alert.classList.remove(action);
      alert.textContent = "";
    }, 2000);
  }
}

// EVENT LISTENENER
addBtn.addEventListener("click", () => {
  UI.createColor();
});
randomBtn.addEventListener("click", () => {
  UI.shuffleColor();
});
delBtn.addEventListener("click", () => {
  if (colors.children.length > 0) {
    document.querySelectorAll(".color").forEach((item) => {
      item.remove();
      UI.displayAlert("All Color Deleted", "danger");
      guide.style.display = "block";
    });
    localStorage.removeItem("colors");
  }
});

colors.addEventListener("click", (e) => {
  if (e.target.classList.contains("color-bar")) {
    UI.changeColor(e.target);
  }
});

class Storage {
  static getColors() {
    return localStorage.getItem("colors")
      ? JSON.parse(localStorage.getItem("colors"))
      : [];
  }
  static createLocalColor(id, hex) {
    let colors = Storage.getColors();
    const newColor = {
      id,
      hex,
    };
    colors.push(newColor);

    localStorage.setItem("colors", JSON.stringify(colors));
  }
  static editLocalColor(id, hex) {
    let colors = Storage.getColors();
    colors = colors.map((color) => {
      if (color.id === id) {
        color.hex = hex;
      }

      return color;
    });
    localStorage.setItem("colors", JSON.stringify(colors));
  }

  static removeLocalColor(id, hex) {
    let colors = Storage.getColors();
    colors = colors.filter((color) => {
      if (color.id !== id) {
        return color;
      }
    });
    localStorage.setItem("colors", JSON.stringify(colors));
  }
}

window.addEventListener("DOMContentLoaded", () => {
  guide.style.display = "none";
  if (Storage.getColors().length > 0) {
    Storage.getColors().forEach((color) => UI.displayColor(color));
  } else {
    guide.style.display = "block";
  }
});

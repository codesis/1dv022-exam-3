export default function (rows, cols, container) {
  container = document.getElementById(container)
  for (let i = 0; i < rows * cols; i += 1) {
    let img = document.createElement('img')
    img.setAttribute('src', 'image/0.jpeg')
    container.appendChild(img)

    if ((i + 1) % cols === 0) {
      container.appendChild(document.createElement('br'))
    }
  }
}

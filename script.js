const form = document.querySelector('#reportForm');
const photoInput = document.querySelector('#photoInput');
const photoGrid = document.querySelector('#photoGrid');
const fields = ['school','title','time','venue','organizer','participants','cost','impact','status','summary','improvement'];

function setText(id, value) { document.querySelector(id).textContent = value || '-'; }
function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('ms-MY', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value + 'T00:00:00'));
}
function renderObjectives(value) {
  const list = document.querySelector('#rObjectives');
  list.innerHTML = '';
  const items = value.split('\n').map(item => item.trim()).filter(Boolean);
  (items.length ? items : ['-']).forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    list.appendChild(li);
  });
}
function updateReport() {
  const data = new FormData(form);
  fields.forEach(name => setText(`#r${name[0].toUpperCase()}${name.slice(1)}`, data.get(name)));
  setText('#rDate', formatDate(data.get('date')));
  renderObjectives(data.get('objectives') || '');
}
function renderPhotos(files) {
  photoGrid.innerHTML = '';
  if (!files.length) {
    const empty = document.createElement('div');
    empty.textContent = 'Tambah gambar untuk pratonton.';
    photoGrid.appendChild(empty);
    return;
  }
  [...files].slice(0, 6).forEach(file => {
    const img = document.createElement('img');
    img.alt = `Gambar aktiviti: ${file.name}`;
    img.src = URL.createObjectURL(file);
    photoGrid.appendChild(img);
  });
}
form.date.valueAsDate = new Date();
form.addEventListener('input', updateReport);
form.addEventListener('reset', () => setTimeout(() => { form.date.valueAsDate = new Date(); updateReport(); renderPhotos([]); }, 0));
photoInput.addEventListener('change', event => renderPhotos(event.target.files));
document.querySelector('#printBtn').addEventListener('click', () => window.print());
updateReport();

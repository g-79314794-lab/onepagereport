export function PhotoUploader({ count, photos, setPhotos }) {
  const slots = Array.from({ length: count }, (_, i) => photos[i] || null);
  const addFile = async (file, index) => {
    if (!file || !['image/jpeg','image/png','image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024) { alert('Sila pilih JPG, PNG atau WEBP tidak melebihi 10 MB.'); return; }
    let uploaded = {};
    try {
      const formData = new FormData();
      formData.append('photo', file);
      uploaded = await fetch('/api/uploads', { method: 'POST', body: formData }).then((res) => res.json());
    } catch {
      uploaded = {};
    }
    const next = [...photos]; next[index] = { id: crypto.randomUUID(), file, url: uploaded.url, preview: uploaded.url || URL.createObjectURL(file), name: file.name }; setPhotos(next.slice(0, count));
  };
  const remove = (index) => setPhotos(photos.filter((_, i) => i !== index));
  return <div className="upload-grid">{slots.map((photo, index)=><label className="upload-box" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>{e.preventDefault(); addFile(e.dataTransfer.files[0], index);}} key={index}>{photo ? <><img src={photo.preview} alt={photo.name}/><button type="button" onClick={(e)=>{e.preventDefault(); remove(index);}}>Padam / Ganti</button></> : <><span>Seret & Lepas</span><small>Klik untuk muat naik gambar {index + 1}</small></>}<input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e)=>addFile(e.target.files[0], index)}/></label>)}</div>;
}

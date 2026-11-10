// Lectura de vouchers: imágenes (se comprimen) o PDF liviano. Con backend real se subirán a un almacenamiento de archivos.
export const fileToData=file=>new Promise((res,rej)=>{
if(!file)return rej(new Error('Adjunta la imagen o PDF del voucher.'))
if(file.type==='application/pdf'){if(file.size>900*1024)return rej(new Error('El PDF supera 900 KB. Sube una imagen o un PDF más liviano.'));const r=new FileReader();r.onload=()=>res({data:r.result,name:file.name,kind:'pdf'});r.onerror=()=>rej(new Error('No se pudo leer el archivo.'));return r.readAsDataURL(file)}
if(!file.type.startsWith('image/'))return rej(new Error('Formato no válido. Sube una imagen (JPG o PNG) o un PDF.'))
if(file.size>5*1024*1024)return rej(new Error('La imagen supera 5 MB.'))
const img=new Image(),u=URL.createObjectURL(file)
img.onload=()=>{const k=Math.min(1,1000/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);res({data:c.toDataURL('image/jpeg',0.7),name:file.name,kind:'img'})}
img.onerror=()=>rej(new Error('No se pudo leer la imagen.'));img.src=u})

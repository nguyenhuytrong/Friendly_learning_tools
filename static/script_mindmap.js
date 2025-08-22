window.addEventListener("DOMContentLoaded", (event) => {
    // const loading = document.getElementById("loading-overlay")
    let mindmapind = 0;
    const uploadInput = document.getElementById("upload-anh");
    const preview = document.getElementById("preview");
    const useButton = document.getElementById("use-button");
    const result_section = document.getElementById("result-section")
  
    let uploadedFilename = "";
  
    async function handleImageUpload() {
        const file = uploadInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const image = new Image();
                image.src = e.target.result;
                image.style.width = "100%";
                image.style.height = "100%";
                image.style.objectFit = "contain";
                preview.innerHTML = "";
                preview.appendChild(image);
            };
            reader.readAsDataURL(file);
        }
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            const response = await fetch("/save-image", {
                method: "POST",
                body: formData
            });
            const result = await response.json();
            uploadedFilename = result["filename"]
        }
    }
  
    async function handleUseButtonClick() {
        document.querySelector("#loading-overlay").style.display = "flex";
        let result = ""
        const file = uploadInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append("image", file);
            let response = await fetch("/ocr", {
                method: "POST",
                body: formData
            });
            result = await response.json();
            result = result["message"]
            console.log(result)
        } else {
            const vanban = document.getElementById("upload-vanban")
            result = vanban.value;
        }
        
        // const formdata = new FormData();
        // formdata.append("message", result)
        let formdata = JSON.stringify({ "message": result, "mindmapind": mindmapind.toString() })
        let response = await fetch("/mindmap_gen", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },     
            body: formdata
        });
        const image = document.createElement("img")
        image.src = "./static/mindmap" + mindmapind + ".png"
        image.onclick = () => {
            window.open(image.src, '_blank').focus();
        }
        image.style.maxWidth = "90%";
        result_section.innerHTML = "";
        result_section.appendChild(image);
        mindmapind += 1
        // answer = await response.json();
        document.querySelector("#loading-overlay").style.display = "none";
        document.body.classList.remove("loading");
    }

    uploadInput.addEventListener("change", handleImageUpload);
    useButton.addEventListener("click", handleUseButtonClick);
});

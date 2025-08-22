window.addEventListener("DOMContentLoaded", (event) => {
    let strtellind = 0
    const uploadInput = document.getElementById("upload-anh");
    const preview = document.getElementById("preview");
    const useButton = document.getElementById("use-button");
    const result_section = document.getElementById("result-section");

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
            const response = await fetch("/ocr", {
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
        const formData = new FormData();
        formData.append("message", result);
        const response = await fetch("/strtell_gen", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },     
            body: JSON.stringify({ "message": result, "strtellind": strtellind })
        });
        
        a = document.createElement("a")
        a.src = response["url"]
        result_section.appendChild(a)
        
        let audio = document.getElementById("strtell_aud")
        if (!audio) {
            audio = document.createElement("audio")
            audio.id = "strtell_aud"
            audio.type = "audio/wav";
            audio.src = "audio/strtell_aud" + strtellind + ".wav";
            audio.controls = true
            result_section.appendChild(audio);
        } else {
            audio.src = "audio/strtell_aud" + strtellind + ".wav"
        }
        strtellind += 1
        document.querySelector("#loading-overlay").style.display = "none";
        document.body.classList.remove("loading");
    }

    uploadInput.addEventListener("change", handleImageUpload);
    useButton.addEventListener("click", handleUseButtonClick);
});

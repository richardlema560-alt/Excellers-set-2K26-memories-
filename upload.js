document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("uploadForm");

    if (!form) {
        console.log("Upload form not found");
        return;
    }


    form.addEventListener("submit", async function (e) {

        e.preventDefault();


        const name = document.getElementById("name").value;
        const category = document.getElementById("event").value;
        const description = document.getElementById("description").value;
        const file = document.getElementById("file").files[0];
        const status = document.getElementById("status");


        if (!file) {
            status.innerHTML = "Please select a photo or video";
            return;
        }


        status.innerHTML = "Uploading...";


        const fileName = Date.now() + "_" + file.name;


        // Upload file to Supabase Storage
        const { error: uploadError } = await supabaseClient
            .storage
            .from("Memories")
            .upload(fileName, file);


        if (uploadError) {
            status.innerHTML = "Upload failed: " + uploadError.message;
            console.log(uploadError);
            return;
        }


        // Get public file URL
        const { data: urlData } = supabaseClient
            .storage
            .from("Memories")
            .getPublicUrl(fileName);


        const fileURL = urlData.publicUrl;


        // Save memory details to database
        const { error: databaseError } = await supabaseClient
            .from("memories")
            .insert([
                {
                    name: name,
                    category: category,
                    description: description,
                    file_url: fileURL,
                    created_at: new Date()
                }
            ]);


        if (databaseError) {
            status.innerHTML = "Database error: " + databaseError.message;
            console.log(databaseError);
            return;
        }


        status.innerHTML = "Memory uploaded successfully 🎉";


        form.reset();

    });

});
document.addEventListener("DOMContentLoaded", async function () {

    const gallery = document.getElementById("gallery");


    const { data: memories, error } = await supabaseClient
        .from("memories")
        .select("*")
        .order("created_at", { ascending: false });


    if (error) {
        gallery.innerHTML = "Failed to load memories: " + error.message;
        console.log(error);
        return;
    }


    if (memories.length === 0) {
        gallery.innerHTML = "No memories uploaded yet.";
        return;
    }


    gallery.innerHTML = "";


    memories.forEach(function(memory) {


        const card = document.createElement("div");

        card.className = "memory-card";


        let media;


        if (memory.file_url.match(/\.(mp4|webm|ogg)$/i)) {

            media = `
            <video controls width="300">
                <source src="${memory.file_url}">
            </video>
            `;

        } else {

            media = `
            <img src="${memory.file_url}" width="300">
            `;

        }


        card.innerHTML = `

            ${media}

            <h3>${memory.name}</h3>

            <p>${memory.category}</p>

            <p>${memory.description || ""}</p>

        `;


        gallery.appendChild(card);


    });


});
"use strict";

// Sample project data (replace with your actual project data)
const projects = [
    {
        title: "Accessible Playground",
        description: "We are thrilled to introduce a brand-new accessible playground, " +
            "designed to ensure every child, regardless of their abilities, " +
            "can enjoy the magic of playtime together.",
        imageSrc: "img/portfolio/accessiblePlayground.png",
    },
    {
        title: "Community Splash Pad",
        description: "Get ready for refreshing fun as we embark on an exciting journey to " +
            "bring a vibrant splashpad project to our community, where families can beat the " +
            "heat, create lasting memories, and cool off in style.",
        imageSrc: "img/portfolio/splashpad.png",
    },
    {
        title: "Community Garden",
        description: "Discover the beauty of nature and the power of community " +
            "in our recently established community garden, a green oasis that not " +
            "only enriches our environment but also provides a space for shared " +
            "gardening experiences and a deeper connection to the earth.",
        imageSrc: "img/portfolio/communityGarden.png",
    },
    {
        title: "STEM Maker Space",
        description: "Step into the future of learning with our state-of-the-art STEM Maker Space, " +
            "where innovation knows no bounds. Discover a world of creativity, hands-on exploration, " +
            "and limitless possibilities for students and community members alike.",
        imageSrc: "img/portfolio/makerSpace.png",
    },
    {
        title: "Community Recycling Program",
        description: "We are thrilled to introduce our innovative Community Recycling Program, " +
            "dedicated to making a greener, more sustainable future a reality in our community. " +
            "Join us in reducing waste, conserving resources, and preserving our environment for " +
            "generations to come.",
        imageSrc: "img/portfolio/recycling.png",
    },
    {
        title: "Senior Citizens' Social Center",
        description: "Excitement fills the air as we prepare to unveil our newly completed Senior " +
            "Citizens' Social Center. This milestone marks our commitment to ensuring that our senior " +
            "residents have a vibrant space to call their own, where they can enjoy a multitude of " +
            "activities, connect with peers, and bask in the warmth of a close-knit community.",
        imageSrc: "img/portfolio/seniorsCentre.png",
    },
];

// IIFE - Immediately Invoked Functional Expression
(function(){
    function DisplayHomePage(){
        console.log("Called DisplayHomePage...");
    }

    function DisplayPortfolioPage(){
        console.log("Called DisplayProductPage...")

        const projectContainer = document.getElementById("project-container");
        const loadMoreButton = document.getElementById("load-more-button");

        // Function to create a project card
        function createProjectCard(project) {

            const col = document.createElement("div");
            col.classList.add("col", "d-flex", "justify-content-center");

            const card = document.createElement("div");
            card.classList.add("card");
            // Set a maximum width for the card
            card.style.maxWidth = "500px";

            const image = document.createElement("img");
            image.classList.add("card-img-top");
            image.src = project.imageSrc;
            image.alt = project.title;

            // Set maximum width and height for the image
            image.style.maxWidth = "500px"; // Adjust the value as needed
            image.style.maxHeight = "200px"; // Adjust the value as needed

            const cardBody = document.createElement("div");
            cardBody.classList.add("card-body");

            const title = document.createElement("h5");
            title.classList.add("card-title");
            title.textContent = project.title;

            const description = document.createElement("p");
            description.classList.add("card-text");

            // Split the description by line breaks and create <br> elements
            const descriptionLines = project.description.split('\n');
            descriptionLines.forEach(line => {
                const lineBreak = document.createElement("br");
                description.appendChild(lineBreak);
                description.appendChild(document.createTextNode(line));
            });

            cardBody.appendChild(title);
            cardBody.appendChild(description);

            card.appendChild(image);
            card.appendChild(cardBody);

            col.appendChild(card);

            return col;
        }

        // Function to display projects on the page
        function displayProjects(startIndex, endIndex) {
            for (let i = startIndex; i < endIndex && i < projects.length; i++) {
                if (!projects[i].displayed) {
                    const projectCard = createProjectCard(projects[i]);
                    projectContainer.appendChild(projectCard);
                    projects[i].displayed = true; // Mark the project as displayed
                }
            }
        }

        // Initialize the "displayed" property for all projects to false
        for (let i = 0; i < projects.length; i++) {
            projects[i].displayed = false;
        }

        let startIndex = 0;
        const projectsPerPage = 2;

        // Initial display of projects
        displayProjects(startIndex, startIndex + projectsPerPage);
        startIndex += projectsPerPage;

        // Event listener for the "Load More" button
        loadMoreButton.addEventListener("click", () => {
            if (startIndex < projects.length) { // Check if there are more projects to display
                displayProjects(startIndex, startIndex + projectsPerPage);
                startIndex += projectsPerPage;
            } else {
                loadMoreButton.disabled = true; // Disable the button if there are no more projects
            }
        });
    }

    function DisplayServicesPage(){
        console.log("Called DisplayAboutPage...")
    }

    function DisplayTeamPage(){
        console.log("Called DisplayServicesPage...")
    }

    function DisplayBlogPage(){
        console.log("Called DisplayContactListPage...");
    }

    function DisplayContactPage(){
        console.log("Called DisplayContactPage...");

        let sendButton = document.getElementById("sendButton")
        let subscribeButton = document.getElementById("subscribeCheckbox")

        sendButton.addEventListener("click", function() {
            if(subscribeButton.checked) {
                let contact= new Contact(fullName.value, contactNumber.value, emailAddress.value);
                if(contact.serialize()){
                    let key = contact.fullName.substring(0,1) + Date.now();
                    localStorage.setItem(key, contact.serialize());
                }
            }
        });
    }



    function Start(){
        console.log("App Started");

        switch(document.title){
            case "Home":
                DisplayHomePage();
                break;
            case "Portfolio":
                DisplayPortfolioPage();
                break;
            case "Services":
                DisplayServicesPage();
                break;
            case "Our Team":
                DisplayTeamPage();
                break;
            case "Blog":
                DisplayBlogPage();
                break;
            case "Privacy Policy":
                DisplayPrivacyPolicyPage();
                break;
            case "Terms Of Service":
                DisplayTermsOfServicePage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;
        }
    }
    window.addEventListener("load", Start);

})();


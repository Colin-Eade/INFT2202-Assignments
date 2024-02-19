/**
 *  @Authors Colin Eade (ID:100329105) and Megan Clarke (ID:100881229).
 *  @Date January 26, 2024.
 *  @File app.js
 *  @Description This is the JavaScript file that contains all the functions to run the Harmony Hub Website. We utilize
 *  an IIFE to immediately invoke the site when it is launched and dynamically select which page functions to load
 *  based on the title of the page that was loaded.
 */

"use strict";

// Page title prefix
const titlePrefix = "Harmony Hub - "
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

    /**
     *
     */
    function RegisterFormValidation() {

        let firstNameError = "First name should start with a capital letter and can include hyphens, " +
                                       "apostrophes, or spaces for compound names.";
        let lastNameError = "Last name should start with a capital letter and can include hyphens, " +
                                      "apostrophes, or spaces for compound names.";
        let emailAddressError = "Please enter a valid email address in the format: yourname@example.com.";
        let phoneError = "Please enter a valid 10-digit phone number, with or without the country code.";
        let userNameError = "Username should start with a letter and can include letters, numbers, " +
                                     "underscores, or hyphens, 3 to 16 characters long.";
        let passwordError = "Password must be at least 8 characters long, including an uppercase letter, a " +
                                     "lowercase letter, a number, and a special character.";
        let confirmPasswordError = "The password confirmation does not match the password entered.";

        ValidateOnBlur("#firstName", /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, firstNameError);
        ValidateOnBlur("#lastName", /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, lastNameError);
        ValidateOnBlur("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnBlur("#phone", /^\+?1?\d{10}$/, phoneError);
        ValidateOnBlur("#userName", /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/, userNameError);
        ValidateOnBlur("#password", /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, passwordError);

        ConfirmPwOnBlur("#password", "#confirmPassword", confirmPasswordError);
    }

    function ValidateField(inputFieldId, regEx) {
        return regEx.test($(inputFieldId).val());
    }

    function ConfirmPassword (passwordFieldId, confirmPasswordFieldId) {
        return ($(passwordFieldId).val() === $(confirmPasswordFieldId).val());
    }

    /**
     *
     * @param inputFieldId
     * @param regEx
     * @param errorMessage
     */
    function ValidateOnBlur(inputFieldId, regEx, errorMessage) {
        $(inputFieldId).on("blur", () => {
            RemoveInvalidField(inputFieldId);
            if (!ValidateField(inputFieldId, regEx)) {
                SetInvalidField(inputFieldId, errorMessage);
            }
        });
    }

    /**
     *
     * @param passwordFieldId
     * @param confirmPasswordFieldId
     * @param errorMessage
     */
    function ConfirmPwOnBlur(passwordFieldId, confirmPasswordFieldId, errorMessage) {
        $(confirmPasswordFieldId).on("blur", () => {
            RemoveInvalidField(confirmPasswordFieldId);
            if (!ConfirmPassword(passwordFieldId, confirmPasswordFieldId)) {
                SetInvalidField(confirmPasswordFieldId, errorMessage);
            }
        });
    }

    /**
     *
     * @param inputFieldId
     */
    function RemoveInvalidField(inputFieldId) {
        $(inputFieldId).removeClass("invalid-field");
        $(inputFieldId).popover("dispose");
        $(inputFieldId).next("span").remove();
    }

    /**
     *
     * @param inputFieldId
     * @param errorMessage
     */
    function SetInvalidField(inputFieldId, errorMessage) {
        $(inputFieldId).addClass("invalid-field")
        $(inputFieldId).popover({
            content: errorMessage,
            placement: "right",
            trigger: "hover",
            template: '<div class="popover popover-invalid bs-popover-auto fade show">' +
                '<div class="popover-body popover-body-invalid"></div>' +
                '</div>'
        })
        $(inputFieldId).parent().append('<span class="input-group-text bg-danger text-white">' +
            '<i class="fa-regular fa-circle-xmark"></i>' +
            '</span>');
    }

    /**
     *
     */
    function LoadHeader() {
        $.get("./includes/header.html", (data) => {
            let noPrefixTitle =  document.title.replace(titlePrefix, "");
            $("header").html(data);
            ChangeNavBar();
            $(`li>a:contains(${noPrefixTitle})`).addClass("active").attr("aria-current", "page");
        });
    }

    /**
     *
     */
    function LoaderFooter() {
        $.get("./includes/footer.html", (data) => {
            $("footer").html(data);
        });
    }

    /**
     * Modifies the navigation bar in two ways:
     * 1. Adds a new 'Careers' item to the navigation list.
     * 2. Changes the text of the existing 'Blog' item to 'News'.
     */
    function ChangeNavBar() {

        // Get link list id
        let navList = document.getElementById("navLinkList")

        // Set new list item attributes
        let newItem = document.createElement("li");
        newItem.setAttribute("class", "nav-item");

        // Set new link attributes
        let newLink = document.createElement("a");
        newLink.setAttribute("class", "nav-link");
        newLink.setAttribute("href", "#");
        newLink.setAttribute("id", "navCareersLink");
        newLink.textContent = "Careers";

        // Append the new items
        newItem.appendChild(newLink);
        navList.appendChild(newItem);

        // Change Blog to News
        let blogLink = document.getElementById("navBlogLink");
        blogLink.textContent = "News";

    }

    /**
      Logs to the console when the home page is displayed
     */
    function DisplayHomePage(){
        console.log("Called DisplayHomePage...");
    }

    /**
        Called to display the portfolio page and dynamically create the project cards for display
     */
    function DisplayPortfolioPage(){
        console.log("Called DisplayPortfolioPage...");

        const projectContainer = document.getElementById("project-container");
        const loadMoreButton = document.getElementById("load-more-button");

        /**
            Function to create a project card
         */
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

        /**
         * Function to display projects on the page
         */
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

    /**
     * Called when the services page is displayed and logs to the console
     */
    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage...");
    }

    /**
     * Called when the Team page is displayed and logs to the console
     */
    function DisplayTeamPage(){
        console.log("Called DisplayTeamPage...")
    }

    /**
     * Called when the Blog page is displayed, logs to the console and updates the DOM to display "Community News"
     * instead of "Community Blog"
     */
    function DisplayBlogPage(){
        console.log("Called DisplayContactListPage...");

        let blogPageHeading = document.getElementsByTagName("h1")[0]
        blogPageHeading.textContent = "Community News";

        document.title = "Harmony Hub - News"
    }

    /**
     * Displays the contact page and sets up event listeners for form submission and modal interactions.
     */
    function DisplayContactPage() {
        console.log("Called DisplayContactPage...");

        // Obtain references to form elements and modals
        let contactForm = document.getElementById('contactForm');
        let modalSubmit = document.getElementById("modalSubmit");

        // Initialize Bootstrap modals
        let contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
        let redirectModal = new bootstrap.Modal(document.getElementById('redirectModal'));

        // Set up event listeners
        contactForm.addEventListener("submit", SubmitContactForm);
        modalSubmit.addEventListener("click", SubmitModalSubmitClick);

        /**
         * Handles the submission of the contact form.
         * Prevents default form submission, checks form validity, and shows the contact modal.
         * @param {Event} event - The event for the form submission.
         */
        function SubmitContactForm(event) {
            event.preventDefault();
            if (!contactForm.checkValidity())
                return;
            PopulateSubmitModal();
            contactModal.show();
        }

        /**
         * Populates the contact modal with data from the form.
         */
        function PopulateSubmitModal() {
            // Retrieve form field elements
            let formFullName = document.getElementById("fullName").value;
            let formEmailAddress = document.getElementById("emailAddress").value;
            let formSubject = document.getElementById("subject").value;
            let formMessage = document.getElementById("message").value;

            // Retrieve modal elements
            let modalFullName = document.getElementById("modalFullName");
            let modalEmailAddress = document.getElementById("modalEmailAddress");
            let modalSubject = document.getElementById("modalSubject");
            let modalMessage = document.getElementById("modalMessage");

            // Update text content of modal elements
            modalFullName.textContent = formFullName;
            modalEmailAddress.textContent = formEmailAddress;
            modalSubject.textContent = formSubject;
            modalMessage.textContent = formMessage;
        }

        /**
         * Handles the click event on the modal submit button.
         * Hides the contact modal, resets the form, and displays a redirect modal with a countdown.
         */
        function SubmitModalSubmitClick() {
            contactModal.hide();
            contactForm.reset();
            RedirectModalCountdown();
            redirectModal.show();
        }

        /**
         * Initiates the countdown for the redirect modal and hides it when the countdown reaches zero.
         * Uses Lodash's delay function to schedule the redirection.
         */
        function RedirectModalCountdown() {
            // Lodash delay for redirect
            _.delay(RedirectToHome, 5500);

            // Counter displayed on modal
            let counter = 5;
            let counterDisplay = document.getElementById("redirectCounter");
            counterDisplay.textContent = counter;

            // Update the countdown every second and hide the modal at the end
            let interval = setInterval(function() {
                counter--;
                counterDisplay.textContent = counter;
                if (counter <= 0) {
                    clearInterval(interval);
                    redirectModal.hide();
                }
            }, 1000);
        }

        /**
         * Redirects the user to the home page.
         */
        function RedirectToHome() {
            window.location.href = "index.html";
        }
    }

    /**
     * Called when the Privacy Policy page is displayed, logs to the console
     */
    function DisplayPrivacyPolicyPage(){
        console.log("Called DisplayPrivacyPolicyPage...");
    }

    /**
     * Called when the Display Terms Of Service Page is displayed, logs to the console
     */
    function DisplayTermsOfServicePage(){
        console.log("Called DisplayTermsOfServicePage...");
    }

    /**
     *
     */
    function DisplayEventsPage() {
        console.log("Called DisplayEventsPage...");
    }

    /**
     *
     */
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage...");
    }

    /**
     *
     */
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage...");
    }

    /**
     *
     */
    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage...");

        RegisterFormValidation();

        $("#registerButton").on("click", function () {
            let success = false

            $(".form-control").each(function () {
                $(this).focus().blur();
            })
            .each(function () {
                if (!$(this).hasClass("invalid-field")) {
                    success = true;
                } else {
                    success = false;
                    return false
                }
            });
            // TODO: SUCCESS LOGIC AND UPLOAD TO JSON
            if (success) {

            }

        });
    }

    /**
     * Called when the website is launched to create the header and footer to display on the page. A switch statement
     * is used to detect which page has been loaded based on the Document Title.
     */
    function Start(){

        console.log("App Started");

        // Generate the header and footer
        LoadHeader();
        LoaderFooter();

        // Switch function depending on page
        switch (document.title) {
            case `${titlePrefix}Home`:
                DisplayHomePage();
                break;
            case `${titlePrefix}Portfolio`:
                DisplayPortfolioPage();
                break;
            case `${titlePrefix}Services`:
                DisplayServicesPage();
                break;
            case `${titlePrefix}Team`:
                DisplayTeamPage();
                break;
            case `${titlePrefix}Blog`:
                DisplayBlogPage();
                break;
            case `${titlePrefix}Privacy Policy`:
                DisplayPrivacyPolicyPage();
                break;
            case `${titlePrefix}Terms Of Service`:
                DisplayTermsOfServicePage();
                break;
            case `${titlePrefix}Contact Us`:
                DisplayContactPage();
                break;
            case `${titlePrefix}Events`:
                DisplayEventsPage();
                break;
            case `${titlePrefix}Gallery`:
                DisplayGalleryPage();
                break;
            case `${titlePrefix}Login`:
                DisplayLoginPage();
                break;
            case `${titlePrefix}Register`:
                DisplayRegisterPage();
                break;
        }
    }
    window.addEventListener("load", Start);

})();


/**
 *  @Authors Colin Eade (ID:100329105) and Megan Clarke (ID:100881229).
 *  @Date January 26, 2024.
 *  @File app.js
 *  @Description This is the JavaScript file that contains all the functions to run the Harmony Hub Website. We utilize
 *  an IIFE to immediately invoke the site when it is launched and dynamically select which page functions to load
 *  based on the title of the page that was loaded.
 */

"use strict";

//region Globals
const titlePrefix = "Harmony Hub - "
// end region

//region Format Functions
function formatDate(dateString) {
    const dateParts = dateString.split('-'); // Split the date string into parts
    const year = dateParts[0];
    const month = parseInt(dateParts[1], 10); // Parse month as integer (base 10)
    const day = parseInt(dateParts[2], 10); // Parse day as integer (base 10)

    // Create a Date object
    const date = new Date(year, month - 1, day); // Note: Months are zero-based in JavaScript Date object

    // Array of month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Get the month name from the array using the month index
    const monthName = monthNames[date.getMonth()];

    // Format the date as "Month Day, Year"
    const formattedDate = monthName + ' ' + day + ', ' + year;

    return formattedDate;
}
//endregion

// IIFE - Immediately Invoked Functional Expression
(function(){

    //region Login Session Functions
    /**
     *
     * @returns {boolean}
     */
    function CheckLogin() {
        return !!sessionStorage.getItem("user");
    }

    function CheckLogout() {
        return !!sessionStorage.getItem("logout");
    }
    //endregion

    //region Input Field Functions
    /**
     *
     * @returns {boolean}
     */
    function CheckSubmissionValidity() {
        return $(".invalid-field").length <= 0;
    }

    /**
     *
     * @param inputFieldId
     * @param regEx
     * @returns {boolean}
     */
    function ValidateField(inputFieldId, regEx) {
        if (regEx) {
            return regEx.test($(inputFieldId).val());
        } else {
            return $(inputFieldId).val().trim() !== "";
        }
    }

    function ConfirmPassword (passwordFieldId, confirmPasswordFieldId) {
        return ($(passwordFieldId).val() === $(confirmPasswordFieldId).val());
    }

    /**
     *
     * @param inputFieldId
     * @param inputFieldEvent
     * @param submitButtonId
     * @param regEx
     * @param errorMessage
     */
    function ValidateOnEvent(inputFieldId, inputFieldEvent, submitButtonId, regEx, errorMessage) {

        $(inputFieldId).on(inputFieldEvent, () => {
            RemoveInvalidField(inputFieldId);

            if (!ValidateField(inputFieldId, regEx)) {
                SetInvalidField(inputFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', () => {
            RemoveInvalidField(inputFieldId);

            if (!ValidateField(inputFieldId, regEx)) {
                SetInvalidField(inputFieldId, errorMessage);
            }
        });
    }

    /**
     *
     * @param passwordFieldId
     * @param passwordFieldEvent
     * @param submitButtonId
     * @param confirmPasswordFieldId
     * @param errorMessage
     */
    function ConfirmPwOnEvent(passwordFieldId, passwordFieldEvent, submitButtonId, confirmPasswordFieldId, errorMessage) {
        $(confirmPasswordFieldId).on(passwordFieldEvent, () => {
            RemoveInvalidField(confirmPasswordFieldId);

            if (!ConfirmPassword(passwordFieldId, confirmPasswordFieldId)) {
                SetInvalidField(confirmPasswordFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', () => {
            RemoveInvalidField(passwordFieldId);

            if (!ValidateField(passwordFieldId, regEx)) {
                SetInvalidField(passwordFieldId, errorMessage);
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
        $(inputFieldId).after('<span class="input-group-text bg-danger text-white">' +
                                            '<i class="fa-regular fa-circle-xmark"></i>' +
                                        '</span>');
    }
    //endregion

    //region Header and Footer Functions
    /**
     *
     */
    function LoadHeader() {
        $.get("./includes/header.html", (data) => {
            let noPrefixTitle =  document.title.replace(titlePrefix, "");
            $("header").html(data);
            ChangeNavBar();
            NavBarSearch();

            if(CheckLogin()) {
                SetLoggedInNavBar();
                SetWelcomeMessage();

            } else if (CheckLogout()) {
                SetLogoutMessage();
            }
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

        // Create new list item and link
        let $newItem = $('<li class="nav-item"></li>');
        let $newLink = $('<a class="nav-link" href="#" id="navCareersLink">Careers</a>');

        // Append the new link to the new list item
        $newItem.append($newLink);

        // Insert the new item after the gallery link
        $('#navGalleryLink').closest('li').after($newItem);

        // Change Blog to News
        $('#navBlogLink').text('News');

    }

    /**
     *
     */
    function NavBarSearch() {
        let navSearchInput = $("#navSearchInput");
        let navSearchDropdown = $("#navSearchDropdown");
        let navSearchButton = ($("#navSearchButton"));
        let firstResultUrl = null;

        navSearchButton.on("click", () => {
            if (firstResultUrl) {
                window.location.href = firstResultUrl;
            }
        });

        navSearchInput.on("keydown", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        navSearchInput.on("keyup", function() {
            let searchTerm = $(this).val().toLowerCase();
            let urls = ["./team.html", "./services.html", "./portfolio.html", "./blog.html", "./events.html",
                                "./gallery.html", "./register.html", "./login.html", "./contact.html", "./privacy_policy.html",
                                "./terms_of_service.html"
            ];

            firstResultUrl = null;
            navSearchDropdown.empty();

            if (searchTerm.length <= 2) {
                navSearchDropdown.hide();
            } else {
                let matchFound = false;
                let count = 0;

                navSearchDropdown.show();

                for (const url of urls) {
                    $.get(url, function(data) {
                        let textContent = $(data).text().toLowerCase();

                        let index = textContent.indexOf(searchTerm);

                        if (index !== -1) {

                            matchFound = true;

                            if (firstResultUrl === null) {
                                firstResultUrl = url;
                            }

                            let start = Math.max(index - 20, 0);
                            let end = Math.min(index + searchTerm.length + 20, textContent.length);

                            let snippetStart = start > 0 ? "..." : "";
                            let snippetEnd = end < textContent.length ? "..." : "";
                            let searchSnippet = snippetStart + textContent.substring(start, end).trim() + snippetEnd;

                            if (navSearchDropdown.children().length < 5) {
                                let filename = url.split('/').pop();
                                let listItem = `<a class="dropdown-item d-flex justify-content-between align-items-center me-5" href="${url}">
                                                           <span>${searchSnippet}</span>
                                                           <span class="small text-secondary">${filename}</span>
                                                        </a>`;
                                navSearchDropdown.append(listItem).show();
                            }
                        }
                        count++;

                        if (count === urls.length && matchFound === false) {
                            navSearchDropdown.append('<span class="dropdown-item">No results found</span>').show();
                        }
                    });
                }
            }
        });
    }

    function SetLoggedInNavBar() {
        $("#navLoginLink").html('<i class="fa-solid fa-user"></i>').attr({
            "id": "navUserButton",
            "class": "nav-link dropdown-toggle",
            "href": "#",
            "role": "button",
            "data-bs-toggle": "dropdown",
            "aria-expanded": "false"
        }).parent().addClass("dropdown");

        $("#navUserButton").after(`<ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navUserButton">
                                       <li><a id="navLogoutLink" class="dropdown-item" href="#">Logout</a></li>
                                   </ul>`);

        $("#navLogoutLink").on("click", () => {
            sessionStorage.clear();
            location.href = "login.html";
            sessionStorage.setItem("logout", "true");
        });
    }

    /**
     *
     */
    function SetWelcomeMessage() {
        if(!sessionStorage.getItem("welcomed")) {

            let user = new HarmonyHub.User();
            let userData = sessionStorage.getItem("user");

            if (userData) {
                user.deserialize(userData);

                $("#navUserButton").closest("li")
                    .before(`<li class="nav-item" id="navMessageWrapper">
                                <span id="navMessage" class="nav-link">
                                    Welcome back, ${user.firstName}!
                                </span>
                            </li>`);

                sessionStorage.setItem("welcomed", "true");

                setTimeout(() => {
                    $("#navMessageWrapper").remove();
                }, 6000);
            }
        }
    }

    /**
     *
     */
    function SetLogoutMessage() {
        console.log("logout message")
        $("#navLoginLink").closest("li")
            .before(`<li class="nav-item" id="navMessageWrapper">
                         <span id="navMessage" class="nav-link">
                             Logout successful!
                         </span>
                     </li>`);
        
        sessionStorage.clear();

        setTimeout(() => {
            $("#navMessageWrapper").remove();
        }, 6000);
    }
    //endregion

    //region Home Page Functions
    /**
      Logs to the console when the home page is displayed
     */
    function DisplayHomePage(){
        console.log("Called DisplayHomePage...");
        let page = 1;
        let searchInput = "Durham Region Ontario";

        $("#newsSearchInput").on('keydown', function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        //NewsAPIFetch(searchInput, page);

        $("#newsSearchButton").on("click", () => {
            searchInput = $("#newsSearchInput").val();
            page = 1;

            $("#homeArticleArea").empty();

            NewsAPIFetch(searchInput, page);
        });

        $("#newsScrollDownButton").on("click", () => {
            page ++;

            $("#homeArticleArea").empty();

            NewsAPIFetch(searchInput, page);
        });

        $("#newsScrollUpButton").on("click", () => {
            page --;

            $("#homeArticleArea").empty();

            NewsAPIFetch(searchInput, page);
        });

    }

    /**
     *
     */
    function NewsAPIFetch(keywords, page) {
        const pageSize = 5
        const key = "18c00679c61248edbdf53cfaeee600c0";
        let url =  `https://newsapi.org/v2/everything?q=${keywords}&pageSize=${pageSize}&page=${page}&apiKey=${key}`;

        $.get(url, function(data) {
            NewsAPIFetchSuccess(data, page, pageSize);
        }).fail(NewsAPIFail)
    }

    /**
     *
     * @param data
     * @param page
     * @param pageSize
     */
    function NewsAPIFetchSuccess(data, page, pageSize) {

        let scrollDownButton = $("#newsScrollDownButton");
        let scrollUpButton = $("#newsScrollUpButton");

        if (data.status === "ok") {

            if (data.totalResults) {

                scrollDownButton.removeClass("disabled");
                scrollUpButton.removeClass("disabled");

                let maxPages = Math.ceil(data.totalResults / pageSize);

                if (page <= 1) {
                    scrollUpButton.addClass("disabled");
                }
                if (page >= maxPages) {
                    scrollDownButton.addClass("disabled");
                }

                for (const article of data.articles) {
                    let articleHtml = `
                        <a href="${article.url}" class="list-group-item list-group-item-action mt-1 border-top"
                        target="_blank" rel="noopener noreferrer">
                            <h5 class="mb-1">${article.title || "No title"}</h5>
                            <p class="mb-1 text-muted small">
                                ${new Date(article.publishedAt).toLocaleDateString() || "No date"}
                                 | ${article.source.name || "No source name"} 
                                 | ${article.author || "No author"}
                            </p>
                            <p class="mb-1">${article.description || "No description"}</p>
                        </a>`;

                    $('#homeArticleArea').append(articleHtml);

                }
            } else {

                scrollDownButton.addClass("disabled");
                scrollUpButton.addClass("disabled");

                let articleHtml = `
                        <div class="list-group-item mt-1">
                            <p class="mb-1">No articles to display. Please try another search.</p>
                        </div>`;

                $('#homeArticleArea').append(articleHtml);
            }
        }
    }

    /**
     *
     * @param data
     */
    function NewsAPIFail(data) {

        $("#newsScrollDownButton").addClass("disabled");
        $("#newsScrollUpButton").addClass("disabled");

        let errorHtml = `
                        <div class="list-group-item mt-1 border-top">
                            <div class="d-flex justify-content-center align-items-center text-center">
                                <h3 class="mb-1" >
                                    <i class="fas fa-exclamation-triangle"></i><br>
                                    Error
                                </h3>       
                            </div>`;

        if (!$("#newsSearchInput").val()) {
            errorHtml += `<p class="mb-1">
                              Search field is empty. Please enter a topic to search. 
                              For example, you can search for 'technology', 'politics', 
                              'sports', or any specific event or topic you're interested in. 
                              Make sure to use keywords that are likely to produce relevant results.
                          </p>`;
        } else if (data.responseJSON && data.responseJSON.message) {
            errorHtml += `<p class="mb-1">${data.responseJSON.message}</p>`;
        } else {
            `<p class="mb-1">An unexpected error occurred. Please try again later.</p>`
        }
        errorHtml += `</div>`;
        $('#homeArticleArea').append(errorHtml);
    }

    //endregion

    //region Portfolio Page Functions
    /**
        Called to display the portfolio page and dynamically create the project cards for display
     */
    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage...");

        const projectContainer = document.getElementById("project-container");
        const loadMoreButton = document.getElementById("load-more-button");

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

        function displayProjects(projects, startIndex, endIndex) {
            for (let i = startIndex; i < endIndex && i < projects.length; i++) {
                if (!projects[i].displayed) {
                    const projectCard = createProjectCard(projects[i]);
                    projectContainer.appendChild(projectCard);
                    projects[i].displayed = true; // Mark the project as displayed
                }
            }
        }

        // Function to load projects using AJAX
        function loadProjects() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/projects.json', true);

            xhr.onload = function() {
                if (this.status === 200) {
                    // Parse the JSON response
                    const response = JSON.parse(this.responseText);

                    // Access the 'projects' array within the parsed object
                    const projects = response.projects;

                    // Proceed with the rest of your code, now that `projects` correctly references the array
                    projects.forEach(project => project.displayed = false);

                    let startIndex = 0;
                    const projectsPerPage = 2;

                    // Initial display of projects
                    displayProjects(projects, startIndex, startIndex + projectsPerPage);
                    startIndex += projectsPerPage;

                    // Event listener for the "Load More" button
                    loadMoreButton.addEventListener("click", function handleLoadMore() {
                        if (startIndex < projects.length) {
                            displayProjects(projects, startIndex, startIndex + projectsPerPage);
                            startIndex += projectsPerPage;
                        } else {
                            loadMoreButton.disabled = true;
                        }
                    });
                } else {
                    console.error("Failed to load projects:", this.statusText);
                }
            };

            xhr.onerror = function() {
                console.error("Request failed");
            };

            xhr.send();
        }

        // Call loadProjects to initiate the AJAX request
        loadProjects();
    }
    //endregion

    //region Services Page Functions
    /**
     * Called when the services page is displayed and logs to the console
     */
    function DisplayServicesPage(){
        console.log("Called DisplayServicesPage...");
    }
    //endregion

    //region Team Page Functions
    /**
     * Called when the Team page is displayed and logs to the console
     */
    function DisplayTeamPage(){
        console.log("Called DisplayTeamPage...")
    }
    //endregion

    //region Blog Page Functions
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
    //endregion

    //region Contact Page Functions
    /**
     * Displays the contact page and sets up event listeners for form submission and modal interactions.
     */
    function DisplayContactPage() {
        console.log("Called DisplayContactPage...");

        FeedbackCard();
        ContactFormValidation();

        // Obtain references to form elements and modals
        let submitButton = document.getElementById('formSubmit');
        let modalSubmit = document.getElementById("modalSubmit");

        // Initialize Bootstrap modals
        let contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
        let redirectModal = new bootstrap.Modal(document.getElementById('redirectModal'));

        // Set up event listeners
        submitButton.addEventListener("click", (event) => {
           if (CheckSubmissionValidity()) {
               SubmitContactForm(event);
           }
        });
        modalSubmit.addEventListener("click", SubmitModalSubmitClick);


        /**
         * Handles the submission of the contact form.
         * Prevents default form submission, checks form validity, and shows the contact modal.
         * @param {Event} event - The event for the form submission.
         */
        function SubmitContactForm(event) {
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
     *
     */
    function ContactFormValidation() {
        let fullNameError = "Please enter your full name, starting each part with a capital letter. " +
            "You can include spaces, hyphens, and apostrophes if necessary.";
        let emailAddressError = "Please enter a valid email address in the format: yourname@example.com.";
        let messageError = "Your message cannot be empty. Please provide details so we can assist you better.";

        ValidateOnEvent("#fullName", "blur", "#formSubmit",
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)+$/, fullNameError);
        ValidateOnEvent("#emailAddress", "blur", "#formSubmit",
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnEvent("#message", "blur", "#formSubmit",
                            null, messageError);
    }

    /**
     *
     */
    function FeedbackCard() {

        let feedbackMessage = $("#feedBackMessage");
        let feedbackDropdown =  $("#feedBackDropdown");
        let feedbackForm = $("#feedBackForm");
        let feedbackBody = $("#feedBackBody");

        feedbackForm.show();
        feedbackMessage.hide();
        feedbackDropdown.remove("invalid-field");

        feedbackForm.on('keydown', function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        $("#feedbackSubmit").on("click", ()=> {
           if (feedbackDropdown.val() === "0") {
               feedbackDropdown.addClass("invalid-field");
               feedbackMessage.addClass("alert alert-danger")
                   .text("Please select a rating before submitting your feedback.").show();
           } else {

               $.get("./data/feedback_responses.json", function(data) {
                   let response = data[feedbackDropdown.val()];

                   if($("#feedBackComment").val().trim() !== "") {
                       response += " " + data.commentResponse;
                   }

                   feedbackBody.fadeOut("slow", function() {
                       feedbackForm.hide();
                       feedbackMessage.removeClass("alert-danger").addClass("alert alert-success")
                           .text(response).show();
                       feedbackBody.fadeIn("slow");
                   });
               });
           }
        });
    }
    //endregion

    //region Privacy Policy Page Functions
    /**
     * Called when the Privacy Policy page is displayed, logs to the console
     */
    function DisplayPrivacyPolicyPage(){
        console.log("Called DisplayPrivacyPolicyPage...");
    }
    //endregion

    //region Terms of Service Page Functions
    /**
     * Called when the Display Terms Of Service Page is displayed, logs to the console
     */
    function DisplayTermsOfServicePage(){
        console.log("Called DisplayTermsOfServicePage...");
    }
    //endregion

    //region Events Page Functions

    /**
     *
     */
    function DisplayEventsPage() {
        console.log("Called DisplayEventsPage...");

        $(document).ready(function() {
            // Event listener for dropdown items
            $('.dropdown-item').on('click', function() {
                let filterOption = $(this).text().toLowerCase().trim();
                displayEventCards(filterOption);
            });

            // Initial display of events with default filter option
            displayEventCards('upcoming');
        });

    }

    function displayEventCards(filterOption) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './data/events.json', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let eventsData = JSON.parse(xhr.responseText).events;

                // Filter events based on the selected option
                let filteredEvents = filterEvents(eventsData, filterOption);

                // Sort filtered events by event date
                filteredEvents.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

                const eventsContainer = $("#events-container");
                eventsContainer.empty(); // Clear existing events before adding filtered events

                // Create cards for filtered events
                filteredEvents.forEach(event => {
                    const eventCard = createEventCard(event);
                    eventsContainer.append(eventCard);
                });
            } else {
                console.error('Error fetching JSON data:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Error fetching JSON data:', xhr.statusText);
        };
        xhr.send();
    }

    function createEventCard(event) {
        const card = $("<div>").addClass("card").css("margin", "5px");
        const cardBody = $("<div>").addClass("card-body");

        const title = $("<h5>").addClass("card-title").text(event.eventName);
        const date = $("<p>").addClass("card-text").text("Date: " + formatDate(event.eventDate));
        const location = $("<p>").addClass("card-text").text("Location: " + event.eventLocation);
        const description = $("<p>").addClass("card-text").text(event.eventDescription);

        cardBody.append(title, date, location, description);
        card.append(cardBody);

        return card;
    }

    function filterEvents(events, filterOption) {
        if (filterOption === 'upcoming') {
            return events.filter(event => new Date(event.eventDate) > new Date());
        } else if (filterOption === 'past') {
            return events.filter(event => new Date(event.eventDate) < new Date());
        } else {
            return events; // Return all events if filter option is 'all'
        }
    }
    //endregion

    //region Gallery Page Functions
    /**
     *
     */
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage...");

        // Initial loading of thumbnails with default sorting option (newest)
        loadGalleryThumbnails('newest first');
        // Event listener for dropdown items
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function () {
                const sortOption = this.textContent.toLowerCase().trim(); // Get the text content of the clicked item
                loadGalleryThumbnails(sortOption);
            });
        });
    }

    // Function to load thumbnails based on sorting option
    function loadGalleryThumbnails(sortOption) {
        // Fetch events data from JSON file
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './data/events.json', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let eventsData = JSON.parse(xhr.responseText).events;

                // Sort events based on selected option
                if (sortOption === 'newest first') {
                    eventsData.sort((a, b) => new Date(b.eventDate) - new Date(a.eventDate));
                } else if (sortOption === 'oldest first') {
                    eventsData.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));
                }

                // Create thumbnails based on sorted events data
                createGalleryThumbnails(eventsData);
            } else {
                console.error('Error fetching JSON data:', xhr.statusText);
            }
        };
        xhr.onerror = function() {
            console.error('Error fetching JSON data:', xhr.statusText);
        };
        xhr.send();
    }

    function createGalleryThumbnails(eventsData) {
        const thumbnailsContainer = document.getElementById('thumbnails');
        thumbnailsContainer.innerHTML = ''; // Clear existing thumbnails
        let thumbnailCount = 0;
        let currentRow;

        const currentDate = new Date(); // Get current date

        eventsData.forEach(event => {
            // Parse event date from string to Date object
            const eventDate = new Date(event.eventDate);

            // Check if event date is before the current date
            if (eventDate < currentDate) {

                const thumbnailDiv = document.createElement('div');
                thumbnailDiv.classList.add('col-3');
                thumbnailDiv.style.padding = '10px';

                const thumbnailLink = document.createElement('a');
                thumbnailLink.href = "#";
                thumbnailLink.classList.add('thumbnail');
                thumbnailLink.setAttribute('data-bs-toggle', 'modal');
                thumbnailLink.setAttribute('data-bs-target', '#lightboxModal' + event.eventId);

                const thumbnailImg = document.createElement('img');
                thumbnailImg.src = event.eventImage;
                thumbnailImg.classList.add('img-fluid');
                thumbnailImg.alt = event.eventName;

                thumbnailLink.appendChild(thumbnailImg);
                thumbnailDiv.appendChild(thumbnailLink);

                // Append the thumbnail to the current row
                thumbnailsContainer.appendChild(thumbnailDiv);

                // Create modal for each event
                createGalleryModal(event);

                thumbnailCount++;
            }
        });
    }

    // Function to create modal for each event
    function createGalleryModal(event, thumbnailCount) {
        const modalId = 'lightboxModal' + event.eventId;
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = modalId;
        modal.tabIndex = '-1';
        modal.role = 'dialog';
        modal.setAttribute('aria-labelledby', 'lightboxModalLabel' + event.eventId);
        modal.setAttribute('aria-hidden', 'true');

        const modalDialog = document.createElement('div');
        modalDialog.classList.add('modal-dialog', 'modal-dialog-centered', 'modal-lg');
        modalDialog.role = 'document';

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');

        // Modal Header
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        const modalTitle = document.createElement('h5');
        modalTitle.classList.add('modal-title');
        modalTitle.textContent = event.eventName;
        modalHeader.appendChild(modalTitle);
        modalContent.appendChild(modalHeader);

        // Modal Body
        const modalBody = document.createElement('div');
        modalBody.classList.add('modal-body');
        const eventDate = document.createElement('p');
        eventDate.textContent = 'Date: ' + formatDate(event.eventDate);
        modalBody.appendChild(eventDate);
        const modalImage = document.createElement('img');
        modalImage.src = event.eventImage;
        modalImage.classList.add('img-fluid');
        modalImage.alt = 'Large Image';
        modalBody.appendChild(modalImage);

        modalContent.appendChild(modalBody);

        // Modal Footer
        const modalFooter = document.createElement('div');
        modalFooter.classList.add('modal-footer');
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('btn', 'btn-secondary');
        closeButton.setAttribute('data-bs-dismiss', 'modal');
        closeButton.textContent = 'Close';
        modalFooter.appendChild(closeButton);
        modalContent.appendChild(modalFooter);

        modalDialog.appendChild(modalContent);
        modal.appendChild(modalDialog);

        // Append the modal to the modal container
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.appendChild(modal);
    }
    //endregion

    //region Login Page Functions
    /**
     *
     */
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage...");

        let userNameField = $("#userName");
        let passwordField = $("#password");

        $("#messageArea").hide();

        $("#loginButton").on("click", function () {

            let validInputs = false;

            $("#messageArea").hide();
            RemoveInvalidField(userNameField)
            RemoveInvalidField(passwordField);

            if (ValidateField(userNameField) && ValidateField(passwordField)) {
                validInputs = true
            } else {
                if(!ValidateField(userNameField, null)) {
                    SetInvalidField(userNameField, "Please enter your username.");
                }
                if(!ValidateField(passwordField, null)) {
                    SetInvalidField(passwordField, "Please enter your password.");
                }
            }
            if (validInputs) {

                let success = false;
                let newUser = new HarmonyHub.User();

                $.get("./data/users.json", function(data) {
                    for (const user of data.users) {
                        console.log(user);
                        if (userName.value === user.userName && password.value === user.password) {
                            newUser.fromJSON(user);
                            success = true;
                            break;
                        }
                    }
                    if (success) {
                        sessionStorage.setItem("user", newUser.serialize());
                        location.href = "index.html";
                    } else {
                        $("#loginForm")[0].reset();
                        $("#messageArea").addClass("alert alert-danger")
                            .text("Invalid credentials. Please try again.").show();
                    }
                });
            }
        });
    }
    //endregion

    //region Register Page Functions
    /**
     *
     */
    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage...");

        RegisterFormValidation();

        $("#registerButton").on("click", () => {
            if (CheckSubmissionValidity()) {
                // TODO: SUCCESS LOGIC AND UPLOAD TO JSON
                console.log("Success!")
            }
        });
    }

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

        ValidateOnEvent("#firstName", "blur", "registerButton",
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, firstNameError);
        ValidateOnEvent("#lastName", "blur", "registerButton",
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, lastNameError);
        ValidateOnEvent("#emailAddress", "blur", "registerButton",
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnEvent("#phone", "blur", "registerButton",
                            /^\+?1?\d{10}$/, phoneError);
        ValidateOnEvent("#userName", "blur", "registerButton",
                            /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/, userNameError);
        ValidateOnEvent("#password", "blur", "registerButton",
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, passwordError);
        ConfirmPwOnEvent("#password", "blur", "registerButton",
                    "#confirmPassword", confirmPasswordError);
    }
    //endregion

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


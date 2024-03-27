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

interface GNewsAPIResponse {
    totalArticles: number;
    articles: Array<{
        title: string;
        description: string;
        url: string;
        publishedAt: string;
        source: {
            name: string;
            url: string;
        };
    }>;
}

interface ProjectData {
    title: string;
    description: string;
    imageSrc: string;
    displayed: boolean;
}

interface EventData {

    eventId: string;
    eventName: string;
    eventLocation: string;
    eventDate: string;
    eventImage: string;
    eventDescription: string;
    eventLikeCount: string;
}

interface FeedbackResponses {
    "1": string;
    "2": string;
    "3": string;
    "4": string;
    "5": string;
    commentResponse: string;
}
//endregion

//region Format Functions
function formatDate(dateString: string): string {
    const dateParts: string[] = dateString.split('-'); // Split the date string into parts
    const year: number = parseInt(dateParts[0], 10);
    const month: number = parseInt(dateParts[1], 10); // Parse month as integer (base 10)
    const day: number = parseInt(dateParts[2], 10); // Parse day as integer (base 10)

    // Create a Date object
    const date: Date = new Date(year, month - 1, day); // Note: Months are zero-based in JavaScript Date object

    // Array of month names
    const monthNames: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // Get the month name from the array using the month index
    const monthName: string = monthNames[date.getMonth()];

    // Format the date as "Month Day, Year"
    return monthName + ' ' + day + ', ' + year;
}
//endregion

// IIFE - Immediately Invoked Functional Expression
(function(){

    //region Login Session Functions
    /**
     * Checks if the user is currently logged in by looking for user data in sessionStorage.
     *
     * @returns {boolean} True if user data is found, otherwise, false.
     */
    function CheckLogin(): boolean {
        return !!sessionStorage.getItem("user");
    }

    /**
     * Checks if the logout action has been triggered by looking for a logout flag in sessionStorage.
     *
     * @returns {boolean} True if the logout flag is found, otherwise, false.
     */
    function CheckLogout(): boolean {
        return !!sessionStorage.getItem("logout");
    }


    /**
     *
     */
    function AuthGuard(): void {
        let protected_routes: string[] = ["/event_planning", "/statistics"];
        if (protected_routes.indexOf(location.pathname) > -1) {
            if (!sessionStorage.getItem("user")) {
                location.href = "/login";
            }
        }
    }
    //endregion

    //region Input Field Functions
    /**
     * Checks if there are any input fields currently marked as invalid within the form.
     * This is determined by checking if there are any elements with the class 'invalid-field'.
     * A return value of true indicates that no invalid fields are present, and the form can be submitted.
     *
     * @returns {boolean} Returns true if no elements have the 'invalid-field' class, and false otherwise.
     */
    function CheckSubmissionValidity(): boolean {
        return $(".invalid-field").length <= 0;
    }

    /**
     * Validates the value of an input field against a provided regular expression. If no regular expression is provided,
     * it checks if the input field value is not empty after trimming whitespace.
     *
     * @param inputFieldId The ID of the input field to be validated.
     * @param regEx Optional. The regular expression to test against the input field value.
     * @returns {boolean} True if the input field value passes the regex test or is not empty; otherwise, false.
     */
    function ValidateField(inputFieldId: JQuery<HTMLElement>, regEx: RegExp|null): boolean {
        return regEx ? regEx.test($(inputFieldId).val() as string) : ($(inputFieldId).val() as string).trim() !== "";
    }

    /**
     * Checks if the values of the password and confirm password fields match.
     *
     * @param passwordFieldId The ID of the password input field.
     * @param confirmPasswordFieldId The ID of the confirm password input field.
     * @returns {boolean} True if the values of both fields match; otherwise, false.
     */
    function ConfirmPassword (passwordFieldId: JQuery<HTMLElement>, confirmPasswordFieldId: JQuery<HTMLElement>): boolean {
        return ($(passwordFieldId).val() as string) === ($(confirmPasswordFieldId).val() as string);
    }

    /**
     * Validates if the input date from a given field is a valid date and not in the future compared to today's date.
     *
     * @param dateFieldId The ID of the input field containing the date.
     * @returns {boolean} Returns true if the date is valid and not in the future; otherwise, returns false.
     */
    function ValidateDate(dateFieldId: JQuery<HTMLElement>): boolean {
        let date: Date = new Date($(dateFieldId).val() as string);
        let today: Date = new Date();
        today.setHours(0, 0, 0, 0);

        return !(isNaN(date.getTime()) || date > today);
    }

    /**
     * Attaches validation logic to both an input field event and the click event of a submit button.
     * It removes any existing validation feedback, then validates the input field's value against a regular expression.
     * If validation fails, it sets an invalid field and an error message.
     *
     * @param inputFieldId The ID of the input field to validate.
     * @param inputFieldEvent The event type to listen for on the input field.
     * @param submitButtonId The ID of the submit button.
     * @param regEx The regular expression to test against the input field value.
     * @param errorMessage The error message to display if validation fails.
     */
    function ValidateOnEvent(inputFieldId: JQuery<HTMLElement>, inputFieldEvent: string,
                             submitButtonId: JQuery<HTMLElement>, regEx: RegExp|null, errorMessage: string): void {

        $(inputFieldId).on(inputFieldEvent, (): void => {
            RemoveInvalidField(inputFieldId);

            if (!ValidateField(inputFieldId, regEx)) {
                SetInvalidField(inputFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', (): void => {
            RemoveInvalidField(inputFieldId);

            if (!ValidateField(inputFieldId, regEx)) {
                SetInvalidField(inputFieldId, errorMessage);
            }
        });
    }

    /**
     * Validates that two password fields match both on a specific event of the confirmation password field
     * and on the click event of a submit button. It sets an invalid field and shows an error message if the
     * passwords do not match.
     *
     * @param passwordFieldId The ID of the password field.
     * @param passwordFieldEvent The event type to listen for on the password field.
     * @param submitButtonId The ID of the submit button.
     * @param confirmPasswordFieldId The ID of the confirmation password field.
     * @param errorMessage The error message to display if the passwords do not match.
     */
    function ConfirmPwOnEvent(passwordFieldId: JQuery<HTMLElement>, passwordFieldEvent: string, submitButtonId: JQuery<HTMLElement>,
                              confirmPasswordFieldId: JQuery<HTMLElement>, errorMessage: string): void {

        $(confirmPasswordFieldId).on(passwordFieldEvent, (): void => {
            RemoveInvalidField(confirmPasswordFieldId);

            if (!ConfirmPassword(passwordFieldId, confirmPasswordFieldId)) {
                SetInvalidField(confirmPasswordFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', (): void => {
            RemoveInvalidField(confirmPasswordFieldId);

            if (!ConfirmPassword(passwordFieldId, confirmPasswordFieldId)) {
                SetInvalidField(confirmPasswordFieldId, errorMessage);
            }
        });
    }

    /**
     * Attaches validation logic to both a date input field event and the click event of a submit button.
     * It checks if the date is valid and not in the future. If validation fails, it sets and invalid field
     * and an error message.
     *
     * @param dateFieldId The ID of the date input field to validate.
     * @param dateFieldEvent The event type to listen for on the date input field.
     * @param submitButtonId The ID of the submit button.
     * @param errorMessage The error message to display if the date validation fails.
     */
    function ValidateDateOnEvent(dateFieldId: JQuery<HTMLElement>, dateFieldEvent: string,
                                 submitButtonId: JQuery<HTMLElement>, errorMessage: string): void {

        $(dateFieldId).on(dateFieldEvent, () => {
            RemoveInvalidField(dateFieldId);

            if (!ValidateDate(dateFieldId)) {
                SetInvalidField(dateFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', () => {
            RemoveInvalidField(dateFieldId);

            if (!ValidateDate(dateFieldId)) {
                SetInvalidField(dateFieldId, errorMessage);
            }
        });
    }

    /**
     * Removes visual indicators of validation error from the specified input field.
     *
     * @param inputFieldId The ID of the input field from which to remove validation error indicators.
     */
    function RemoveInvalidField(inputFieldId: JQuery<HTMLElement>): void {
        if ($(inputFieldId).data('bs.popover')) {
            $(inputFieldId).popover("dispose");
        }
        $(inputFieldId).removeClass("invalid-field");
        $(inputFieldId).next("span").remove();
    }

    /**
     * Adds visual indicators of validation error to the specified input field.
     *
     * @param inputFieldId The ID of the input field to mark as invalid.
     * @param errorMessage The error message to display within the popover when the user hovers over the input field.
     */
    function SetInvalidField(inputFieldId: JQuery<HTMLElement>, errorMessage: string): void {
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

    //region Navbar Functions
    /**
     * Loads the website's header from an HTML file and performs various initializations.
     * It updates the header based on the user's login status and adjusts navigation links to reflect the current page.
     */
    function SetNavbar(): void {
        SetActiveLink();
        NavBarSearch();
        if(CheckLogin()) {
            SetLoggedInNavBar();
            SetWelcomeMessage();
        } else if (CheckLogout()) {
            SetLogoutMessage();
        }
    }

    /**
     * Implements a search feature in the navigation bar.
     * This function listens for key events on the search input and dynamically populates a dropdown with search results.
     * It fetches search data from a local JSON file and filters results based on the user's input.
     */
    function NavBarSearch() {
        let navSearchInput = $("#navSearchInput");
        let navSearchDropdown = $("#navSearchDropdown");
        let navSearchButton = ($("#navSearchButton"));
        let firstResultUrl: string|null = null;

        // Navigate to the first search result when the search button is clicked
        navSearchButton.on("click", (): void => {
            if (firstResultUrl) {
                window.location.href = firstResultUrl;
            }
        });

        // Prevent form submission on 'Enter' key
        navSearchInput.on("keydown", function(e): void {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        // Search on keystrokes
        navSearchInput.on("keyup", function(): void {

            let searchTerm: string = ($(this).val() as string).toLowerCase();
            navSearchDropdown.empty();

            // Show dropdown only if search term is longer than 2 characters
            if (searchTerm.length <= 2) {
                navSearchDropdown.hide();

            } else {
                navSearchDropdown.show();

                // Fetch search data from JSON file
                $.get('./data/data_dump.json', function(data): void {

                    let matchFound: boolean = false;

                    // Iterate through each object in JSON
                    for (const page of data.pages) {

                        // Store text data
                        let textContent = page.content
                        let lowerCaseContent = textContent.toLowerCase();
                        let index = lowerCaseContent.indexOf(searchTerm);

                        // Check if the search term is found in the page content
                        if (index !== -1) {
                            matchFound = true;

                            // Set the URL for search button click
                            if (firstResultUrl === null) {
                                firstResultUrl = page.URL;
                            }

                            // Create a string snippet to display in the search dropdown
                            let start: number = Math.max(index - 20, 0);
                            let end: number = Math.min(index + searchTerm.length + 20, textContent.length);

                            let snippetStart: string = start > 0 ? "..." : "";
                            let snippetEnd: string = end < textContent.length ? "..." : "";
                            let searchSnippet: string = snippetStart + textContent.substring(start, end).trim() + snippetEnd;

                            // Make a dropdown list of the search snippets and URL links they are from
                            if (navSearchDropdown.children().length < 5) {
                                let filename = page.URL.split('/').pop();
                                let listItem: string = `
                                            <a class="dropdown-item d-flex justify-content-between align-items-center me-5" href="${page.URL}">
                                                <span>${searchSnippet}</span>
                                                <span class="small text-secondary">${filename}</span>
                                            </a>`;
                                navSearchDropdown.append(listItem).show();
                            }
                        }
                    }
                    // Display "No results found" in dropdown if there are no matches to user input
                    if (!matchFound) {
                        navSearchDropdown.append('<span class="dropdown-item">No results found</span>').show();
                    }
                });
            }
        });
    }

    /**
     *
     */
    function SetActiveLink(): void {
        let noPrefixTitle =  document.title.replace("Harmony Hub - ", "");
        $(`li>a:contains(${noPrefixTitle})`).addClass("active");
    }

    /**
     * Updates the navigation bar to reflect the user's logged-in state.
     * This function modifies the login link and transforms it into a dropdown toggle.
     * The dropdown toggle contains the user's name, email, and a link to logout.
     * The logout action clears the session storage, redirects to the login page, and sets a 'logout' flag to indicate
     * a successful logout.
     */
    function SetLoggedInNavBar(): void {

        let userData: string|null = sessionStorage.getItem("user");

        if (userData) {
            let user: HarmonyHub.User = new HarmonyHub.User();
            user.deserialize(userData);

            // Now, set the link to display user.userName
            $("#navLoginLink").html(`<i class="fa-solid fa-user"></i> ${user.userName}`).attr({
                "id": "navUserButton",
                "class": "nav-link dropdown-toggle",
                "href": "#",
                "role": "button",
                "data-bs-toggle": "dropdown",
                "aria-expanded": "false"
            }).parent().addClass("dropdown");

            $("#navUserButton").after(`
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navUserButton">
                    <li class="px-3 py-1">${user.firstName} ${user.lastName}</li>
                    <li class="px-3 py-1">${user.emailAddress}</li>
                    <div class="dropdown-divider"></div>
                    <li><a id="navEventPlanningLink" class="dropdown-item" href="/event_planning">Plan an Event</a></li>
                    <li><a id="navStatisticsLink" class="dropdown-item" href="/statistics">Statistics</a></li>
                    <li><a id="navLogoutLink" class="dropdown-item" href="#">Logout</a></li>
                </ul>`);
        } else {
            $("#navUserButton").after(`
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navUserButton">
                    <li><a id="navLogoutLink" class="dropdown-item" href="#">Logout</a></li>
                </ul>`);
        }

        $("#navLogoutLink").on("click", (): void => {
            sessionStorage.clear();
            location.href = "/login";
            sessionStorage.setItem("logout", "true");
        });
    }

    /**
     * Displays a temporary welcome message to the user if they haven't been welcomed already.
     * This function checks the session storage for a 'welcomed' flag to avoid repeating the welcome message.
     * If the user data is found in the session storage, it deserializes this data to greet the user by name.
     */
    function SetWelcomeMessage(): void {
        if(!sessionStorage.getItem("welcomed")) {

            let userData: string|null = sessionStorage.getItem("user");

            if (userData) {

                let user: HarmonyHub.User = new HarmonyHub.User();
                user.deserialize(userData);

                $("#navUserButton").closest("li")
                    .before(`
                            <li class="nav-item" id="navMessageWrapper">
                                <span id="navMessage" class="nav-link">
                                    Welcome back, ${user.firstName}!
                                </span>
                            </li>`);

                sessionStorage.setItem("welcomed", "true");

                setTimeout((): void => {
                    $("#navMessageWrapper").remove();
                }, 6000);
            }
        }
    }

    /**
     * Displays a temporary logout message upon user logout.
     * It confirms to the user that they have successfully logged out.
     * Additionally, this function handles the cleanup of the 'logout' flag from the session storage.
     */
    function SetLogoutMessage(): void {
        $("#navLoginLink").closest("li")
            .before(`
                     <li class="nav-item" id="navMessageWrapper">
                         <span id="navMessage" class="nav-link">
                             Logout successful!
                         </span>
                     </li>`);
        
        sessionStorage.removeItem("logout");

        setTimeout((): void => {
            $("#navMessageWrapper").remove();
        }, 6000);
    }
    
    // endregion

    //region Calendar Functions
    
    function InitializeCalendar(): void {
        let calendarEl = document.getElementById('calendar');
        // @ts-ignore
        let calendar = new FullCalendar.Calendar(calendarEl, {
            timeZone: 'UTC',
            themeSystem: 'bootstrap5',
            events: getEvents(),
            // eventClick: displayEvent()
        });
        calendar.render();
    }

    function getEvents(): any[] {
        let events: any[] = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("event_")) { // Check if the key starts with 'event_'
                let event = new HarmonyHub.Event();
                let eventData = localStorage.getItem(key) as string;
                event.deserialize(eventData);

                try {
                    const formattedEvent = {
                        title: event.eventName,
                        start: event.eventDate + 'T' + event.eventTime
                    };
                    events.push(formattedEvent);
                } catch (e) {
                    console.error("Error parsing event data from localStorage for key:", key, "; Error:", e);
                }

            }
        }
        return events;
    }


    //endregion

    //region Home Page Functions
    /**
     * Initializes the home page by setting up event listeners for search and scrolling actions.
     * This function sets up the behavior for the search input, search button, and scroll buttons
     * for navigating through news articles fetched from GNews API.
     */
    function DisplayHomePage(): void {
        console.log("Called DisplayHomePage...");
        let page: number = 1;
        let searchInput: string = "CBC News";

        $("#newsSearchInput").on('keydown', function(e): void {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        GNewsAPIFetch(searchInput, page);

        $("#newsSearchButton").on("click", (): void => {
            searchInput = $("#newsSearchInput").val() as string;
            page = 1;

            $("#homeArticleArea").empty();
            GNewsAPIFetch(searchInput, page);
        });

        $("#newsScrollDownButton").on("click", (): void => {
            page ++;

            $("#homeArticleArea").empty();

            GNewsAPIFetch(searchInput, page);
        });

        $("#newsScrollUpButton").on("click", (): void => {
            page --;

            $("#homeArticleArea").empty();

            GNewsAPIFetch(searchInput, page);
        });
    }

    /**
     * Fetches news articles based on the specified keywords and page number using the GNews API.
     * @param keywords The search keywords used to fetch relevant news articles.
     * @param page The current page number of the API fetch.
     */
    function GNewsAPIFetch(keywords: string, page: number): void {
        const pageSize: number = 3
        const language: string = "en";
        const key: string = "ba7d1c40045850f7ee5b6113b2728729";
        let url: string = `https://gnews.io/api/v4/search?q=${keywords}&max=${pageSize}&page=${page}&lang=${language}&apikey=${key}`;

        ShowPlaceholder();

        // Performs the GET request to the NewsAPI
        $.get(url, function(data): void {
            GNewsAPIFetchSuccess(data, page, pageSize);
        }).fail(GNewsAPIFail)
    }

    /**
     *
     */
    function ShowPlaceholder(): void {
        let placeholdersHtml: string = '';
        for (let i: number = 0; i < 3; i++) {
            placeholdersHtml += `
        <div class="list-group-item mt-1 border-top">
            <div class="placeholder-glow">
                <h5 class="placeholder col-12"></h5>
                <h5 class="mb-1 placeholder col-6"></h5><br>
                <p class="mb-2 placeholder col-5 text-muted small"></p><br>
                <p class="mb-1 placeholder col-12"></p>
                <p class="mb-1 placeholder col-12"></p>
                <p class="mb-1 placeholder col-12"></p>
                <p class="mb-1 placeholder col-6"></p>
            </div>
        </div>`;
        }
        let loadingHtml: string = `<div id="placeholder">${placeholdersHtml}</div>`;
        $('#homeArticleArea').html(loadingHtml);
    }

    /**
     * Handles the successful fetch of news articles from the GNews API, and populates the UI with articles.
     * @param data The JSON response from GNews API containing the articles and metadata.
     * @param page The current page number of the API fetch.
     * @param pageSize The number of articles per API fetch.
     */
    function GNewsAPIFetchSuccess(data: GNewsAPIResponse, page: number, pageSize: number) {
        $("#placeholder").remove();

        let scrollDownButton = $("#newsScrollDownButton");
        let scrollUpButton = $("#newsScrollUpButton");

        // Check if any results returned
        if (data.totalArticles) {

            // Enable scroll buttons
            scrollDownButton.removeClass("disabled");
            scrollUpButton.removeClass("disabled");

            // Calculate the max amount of pages based on total results
            let maxPages = Math.ceil(data.totalArticles / pageSize);

            // Disable scroll up on first page
            if (page <= 1) {
                scrollUpButton.addClass("disabled");
            }

            // Disable scroll down on last page
            if (page >= maxPages) {
                scrollDownButton.addClass("disabled");
            }

            // Iterate through each article in the response and construct an HTML display
            for (const article of data.articles) {
                let articleHtml = `
                    <a href="${article.url}" class="list-group-item list-group-item-action mt-1 border-top"
                    target="_blank" rel="noopener noreferrer">
                        <h5 class="mb-1">${article.title || "No title"}</h5>
                        <p class="mb-1 text-muted small">
                            ${new Date(article.publishedAt).toLocaleDateString() || "No date"}
                             | ${article.source.name || "No source name"} 
                             | ${article.source.url || "No source URL"}
                        </p>
                        <p class="mb-1">${article.description || "No description"}</p>
                    </a>`;

                // Add the article data to the home page article area
                $('#homeArticleArea').append(articleHtml);
            }
        } else {

            // Disable scroll buttons if no results are found
            scrollDownButton.addClass("disabled");
            scrollUpButton.addClass("disabled");

            // Display a message to the user in the articles area
            let articleHtml = `
                    <div class="list-group-item mt-1">
                        <p class="mb-1">No articles to display. Please try another search.</p>
                    </div>`;

            $('#homeArticleArea').append(articleHtml);
        }
    }

    /**
     * Handles failures when fetching news articles from the GNews API.
     * @param data The error response from the News API containing the error details or status.
     */
    function GNewsAPIFail(data: JQuery.jqXHR): void {
        $("#placeholder").remove();

        console.log(data);

        // Disable scroll buttons
        $("#newsScrollDownButton").addClass("disabled");
        $("#newsScrollUpButton").addClass("disabled");

        // Construct error message
        let errorHtml = `
                        <div class="list-group-item mt-1 border-top">
                            <div class="d-flex justify-content-center align-items-center text-center">
                                <h3 class="mb-1" >
                                    <i class="fas fa-exclamation-triangle"></i><br>
                                    Error
                                </h3>       
                            </div>`;

        // Error message for empty search
        if (!$("#newsSearchInput").val()) {
            errorHtml += `<p class="mb-1">
                              Search field is empty. Please enter a topic to search. 
                              For example, you can search for 'technology', 'politics', 
                              'sports', or any specific event or topic you're interested in. 
                              Make sure to use keywords that are likely to produce relevant results.
                          </p>`;

            // Error message if the API returned a specific one
        } else if (data.responseJSON && data.responseJSON.errors) {

            // if errors are in an array
            if (Array.isArray(data.responseJSON.errors)) {

                for (const error of data.responseJSON.errors) {
                    errorHtml += `<p class="mb-1">${error}</p>`;
                }
                // If errors are not in an array
            } else {
                errorHtml += `<p class="mb-1">${data.responseJSON.errors.q}</p>`;
            }

            // Error message for any other error
        } else {
            `<p class="mb-1">An unexpected error occurred. Please try again later.</p>`
        }
        errorHtml += `</div>`;
        $('#homeArticleArea').append(errorHtml);
    }
    //endregion

    //region Portfolio Page Functions
    /**
     * Called to display the portfolio page and dynamically create the project cards for display
     */
    function DisplayPortfolioPage(): void {
        console.log("Called DisplayPortfolioPage...");

        const projectContainer = document.getElementById("project-container") as HTMLElement;
        const loadMoreButton = document.getElementById("load-more-button") as HTMLInputElement;


        /**
         * Checks if the project card has been displayed
         * @param projects
         * @param startIndex
         * @param endIndex
         */
        function displayProjects(projects: ProjectData[], startIndex: number, endIndex: number): void {
            for (let i: number = startIndex; i < endIndex && i < projects.length; i++) {
                if (!projects[i].displayed) {
                    const projectCard = createProjectCard(projects[i]);
                    projectContainer.appendChild(projectCard);
                    projects[i].displayed = true; // Mark the project as displayed
                }
            }
        }

        /**
         * Function to load projects to the page with Ajax
         */
        function loadProjects(): void {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/projects.json', true);

            xhr.onload = function(): void {
                if (this.status === 200) {
                    // Parse the JSON response
                    const response = JSON.parse(this.responseText);

                    // Access the 'projects' array within the parsed object
                    const projects: ProjectData[] = response.projects;

                    // Proceed with the rest of your code, now that `projects` correctly references the array
                    projects.forEach(project => project.displayed = false);

                    let startIndex: number = 0;
                    const projectsPerPage: number = 2;

                    // Initial display of projects
                    displayProjects(projects, startIndex, startIndex + projectsPerPage);
                    startIndex += projectsPerPage;

                    // Event listener for the "Load More" button
                    loadMoreButton.addEventListener("click", function handleLoadMore(): void {
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

    /**
     * Creates a project card with the project details and image
     * @param project
     * @returns {HTMLDivElement}
     */
    function createProjectCard(project: ProjectData) : HTMLDivElement {
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
    //endregion

    //region Services Page Functions
    /**
     * Called when the services page is displayed and logs to the console
     */
    function DisplayServicesPage(): void{
        console.log("Called DisplayServicesPage...");
    }
    //endregion

    //region Team Page Functions
    /**
     * Called when the Team page is displayed and logs to the console
     */
    function DisplayTeamPage(): void{
        console.log("Called DisplayTeamPage...")
    }
    //endregion

    //region Blog Page Functions
    /**
     * Called when the Blog page is displayed, logs to the console and updates the DOM to display "Community News"
     * instead of "Community Blog"
     */
    function DisplayBlogPage(): void {
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
    function DisplayContactPage(): void {
        console.log("Called DisplayContactPage...");

        FeedbackCard();
        ContactFormValidation();

        // Obtain references to form elements and modals
        let submitButton = document.getElementById('formSubmit') as HTMLElement;
        let modalSubmit = document.getElementById("modalSubmit") as HTMLElement;
        let contactForm = document.getElementById("contactForm") as HTMLFormElement;

        // Initialize Bootstrap modals
        let contactModal = new bootstrap.Modal(document.getElementById('contactModal') as HTMLElement);
        let redirectModal = new bootstrap.Modal(document.getElementById('redirectModal') as HTMLElement);

        // Set up event listeners
        submitButton.addEventListener("click", (event): void => {
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
        function SubmitContactForm(event: Event): void {
            event.preventDefault();
            PopulateSubmitModal();
            contactModal.show();
        }

        /**
         * Populates the contact modal with data from the form.
         */
        function PopulateSubmitModal(): void {
            // Retrieve form field elements
            let formFullName: string = (document.getElementById("fullName") as HTMLInputElement).value;
            let formEmailAddress: string= (document.getElementById("emailAddress") as HTMLInputElement).value;
            let formSubject: string = (document.getElementById("subject") as HTMLInputElement).value;
            let formMessage: string = (document.getElementById("message") as HTMLInputElement).value;

            // Retrieve modal elements
            let modalFullName = document.getElementById("modalFullName") as HTMLElement;
            let modalEmailAddress = document.getElementById("modalEmailAddress") as HTMLElement;
            let modalSubject = document.getElementById("modalSubject") as HTMLElement;
            let modalMessage = document.getElementById("modalMessage") as HTMLElement;

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
        function SubmitModalSubmitClick(): void {
            contactModal.hide();
            contactForm.reset();
            RedirectModalCountdown();
            redirectModal.show();
        }

        /**
         * Initiates the countdown for the redirect modal and hides it when the countdown reaches zero.
         * Uses Lodash's delay function to schedule the redirection.
         */
        function RedirectModalCountdown(): void {
            // Lodash delay for redirect
            _.delay(RedirectToHome, 5500);

            // Counter displayed on modal
            let counter: number = 5;
            let counterDisplay = document.getElementById("redirectCounter") as HTMLElement;
            counterDisplay.textContent = counter.toString();

            // Update the countdown every second and hide the modal at the end
            let interval = setInterval(function(): void {
                counter--;
                counterDisplay.textContent = counter.toString();
                if (counter <= 0) {
                    clearInterval(interval);
                    redirectModal.hide();
                }
            }, 1000);
        }

        /**
         * Redirects the user to the home page.
         */
        function RedirectToHome(): void {
            window.location.href = "/index";
        }
    }

    /**
     * Validates the contact form input fields on blur and submission events.
     */
    function ContactFormValidation(): void {
        let fullNameError: string = "Please enter your full name, starting each part with a capital letter. " +
            "You can include spaces, hyphens, and apostrophes if necessary.";
        let emailAddressError: string = "Please enter a valid email address in the format: yourname@example.com.";
        let messageError: string = "Your message cannot be empty. Please provide details so we can assist you better.";

        ValidateOnEvent($("#fullName"), "blur", $("#formSubmit"),
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)+$/, fullNameError);
        ValidateOnEvent($("#emailAddress"), "blur", $("#formSubmit"),
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnEvent($("#message"), "blur", $("#formSubmit"),
                            null, messageError);
    }

    /**
     * Initializes and manages the feedback card UI.
     *
     * This function sets up the behavior for a feedback card component, including event listeners for form submission
     * and input validation.
     */
    function FeedbackCard(): void {

        let feedbackMessage = $("#feedBackMessage");
        let feedbackDropdown =  $("#feedBackDropdown");
        let feedbackForm = $("#feedBackForm");
        let feedbackBody = $("#feedBackBody");

        // Show the feedback form and hide the message element initially
        feedbackForm.show();
        feedbackMessage.hide();
        feedbackDropdown.remove("invalid-field");

        // Prevent form submission with the Enter key
        feedbackForm.on('keydown', function(e): void {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });

        // Submit Button Click
        $("#feedbackSubmit").on("click", (): void => {

            // Make sure a valid rating was selected
           if (feedbackDropdown.val() === "0") {

               // Return an invalid field on the rating if invalid
               feedbackDropdown.addClass("invalid-field");
               feedbackMessage.addClass("alert alert-danger")
                   .text("Please select a rating before submitting your feedback.").show();

           } else {

               // On valid submission Grab a response from JSON
               $.get("./data/feedback_responses.json", function(data: FeedbackResponses): void {

                   // Get specific response based user rating
                   let response: string = data[feedbackDropdown.val() as keyof FeedbackResponses];

                   // Add to response if user left a comment
                   if(($("#feedBackComment").val() as string).trim() !== "") {
                       response += " " + data.commentResponse;
                   }

                   // Fade out and fade back in the feedback card to display "Thank you" response
                   feedbackBody.fadeOut("slow", function(): void {

                       feedbackForm.hide();
                       feedbackMessage.removeClass("alert-danger").addClass("alert alert-success")
                           .text(response).show();

                       feedbackBody.fadeIn("slow");
                   });
               }).fail((): void => {
                   // Generic response if JSON fetch fails
                   let genericResponse: string = "Thank you for your feedback.";

                   feedbackBody.fadeOut("slow", function(): void {

                       feedbackForm.hide();
                       feedbackMessage.removeClass("alert-danger").addClass("alert alert-success")
                           .text(genericResponse).show();

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
    function DisplayPrivacyPolicyPage(): void {
        console.log("Called DisplayPrivacyPolicyPage...");
    }
    //endregion

    //region Terms of Service Page Functions
    /**
     * Called when the Display Terms Of Service Page is displayed, logs to the console
     */
    function DisplayTermsOfServicePage(): void {
        console.log("Called DisplayTermsOfServicePage...");
    }
    //endregion

    //region Events Page Functions
    /**
     * Function called to display the events page
     */
    function DisplayEventsPage(): void {
        console.log("Called DisplayEventsPage...");

        InitializeCalendar();

        $(function(): void {
            // Event listener for dropdown items
            $('.dropdown-item').on('click', function(): void {
                let filterOption: string = $(this).text().toLowerCase().trim();
                displayEventCards(filterOption);
            });

            // Initial display of events with default filter option
            displayEventCards('upcoming');
        });
    }

    /**
     * Function to filter the events by the selected filter option
     * @param filterOption
     */
    function displayEventCards(filterOption: string): void {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './data/events.json', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let eventsData: EventData[] = JSON.parse(xhr.responseText).events;

                // Filter events based on the selected option
                let filteredEvents = filterEvents(eventsData, filterOption);

                // Sort filtered events by event date
                filteredEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());

                const eventsContainer = $("#events-container");
                eventsContainer.empty(); // Clear existing events before adding filtered events

                // Create cards for filtered events
                filteredEvents.forEach(event => {
                    const eventCard = createEventCard(event);
                    eventCard.hide();
                    eventsContainer.append(eventCard);
                    eventCard.fadeIn('slow');
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

    /**
     * Creates a card for an event with the event details and image
     * @param event
     * @returns card
     */
    function createEventCard(event: EventData) {

        const colDiv = $("<div>").addClass("col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex");

        const card = $("<div>").addClass("card")
            .css({ "margin": "5px", "width": "18rem", "position": "relative"});

        // Create an image element for the event
        const cardImage = $("<img>").addClass("card-img-top").attr("src", event.eventImage).attr("alt", event.eventName);

        const cardBody = $("<div>").addClass("card-body");

        const title = $("<h5>").addClass("card-title").text(event.eventName);
        const date = $("<p>").addClass("card-text").text("Date: " + formatDate(event.eventDate));
        const location = $("<p>").addClass("card-text").text("Location: " + event.eventLocation);
        const description = $("<p>").addClass("card-text").text(event.eventDescription);

        const heartIcon = $("<i>")
            .addClass("far fa-heart")
            .css({"cursor": "pointer", "position": "absolute", "bottom": "8px", "right": "10px", "color": "red"});
        // Set the initial like count from localStorage or default to 0 if not found
        const initialLikeCount: number = parseInt(localStorage.getItem(`likeCount-${event.eventId}`) || '0');


        // Create like counter
        const likeCounter: JQuery<HTMLElement> = $("<span>")
            .addClass("like-counter")
            .text(event.eventLikeCount)
            .css({"position": "absolute", "bottom": "5px", "right": "30px", "color": "black"
            });

        likeCounter.text(initialLikeCount.toString());

        // Initial state of the heart icon based on sessionStorage
        if (sessionStorage.getItem(`liked-${event.eventId}`) === 'true') {
            heartIcon.removeClass("far fa-heart").addClass("fas fa-heart");
        } else {
            heartIcon.addClass("far fa-heart");
        }

        // Toggle heart fill on click
        heartIcon.on("click", function() {
            const eventIdKey = `liked-${event.eventId}`;
            const likeCountKey = `likeCount-${event.eventId}`;

            // Check if the event is already liked in this session
            if (sessionStorage.getItem(eventIdKey) === 'true') {
                // If yes, the user is unliking the event.
                $(this).removeClass("fas fa-heart").addClass("far fa-heart");

                // Decrement the like counter in localStorage
                let currentCount: number = parseInt(localStorage.getItem(likeCountKey) || '0');
                let newLikeCount: number = Math.max(currentCount - 1, 0); // Prevent negative counts
                localStorage.setItem(likeCountKey, newLikeCount.toString());
                likeCounter.text(newLikeCount.toString());

                // Update sessionStorage to reflect the event is no longer liked
                sessionStorage.removeItem(eventIdKey);
            } else {
                // If not, the user is liking the event.
                $(this).removeClass("far fa-heart").addClass("fas fa-heart");

                // Increment the like counter in localStorage
                let currentCount: number = parseInt(localStorage.getItem(likeCountKey) || '0');
                let newLikeCount: number = currentCount + 1;
                localStorage.setItem(likeCountKey, newLikeCount.toString());
                likeCounter.text(newLikeCount.toString());

                // Mark the event as liked in this session
                sessionStorage.setItem(eventIdKey, 'true');
            }
        });

        // Append the image and body to the card
        card.append(cardImage, cardBody);
        cardBody.append(title, date, location, description, heartIcon, likeCounter);

        // Append the card to the column div
        colDiv.append(card);

        return colDiv;
    }

    /**
     * Receives an array of events to sort according to the filter option selected.
     * Returns a sorted list based on date.
     * @param events
     * @param filterOption
     * @returns events
     */
    function filterEvents(events: EventData[], filterOption: string): EventData[] {
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
     * Function called to display the Gallery Page
     */
    function DisplayGalleryPage(): void {
        console.log("Called DisplayGalleryPage...");

        // Initial loading of thumbnails with default sorting option (newest)
        loadGalleryThumbnails('newest first');

        // Event listener for dropdown items
        $('.dropdown-item').on('click', function (): void {
            // Using jQuery $(this) to get the clicked item and its text
            const sortOption: string = $(this).text().toLowerCase().trim();
            loadGalleryThumbnails(sortOption);
        });
    }

    /**
     * Function to load thumbnails based on sorting option selected
     * @param sortOption
     */
    function loadGalleryThumbnails(sortOption: string): void {
        // Fetch events data from JSON file
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './data/events.json', true);
        xhr.onload = function() {
            if (xhr.status === 200) {
                let eventsData: EventData[] = JSON.parse(xhr.responseText).events;

                // Sort events based on selected option
                if (sortOption === 'newest first') {
                    eventsData.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
                } else if (sortOption === 'oldest first') {
                    eventsData.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
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

    /**
     * Receives the event data and creates an event card and calls the modal creator function to create
     * the matching modal.
     * @param eventsData
     */
    function createGalleryThumbnails(eventsData: EventData[]): void {
        const thumbnailsContainer = $('#thumbnails');
        thumbnailsContainer.empty(); // Clear existing thumbnails

        const currentDate = new Date(); // Get current date

        eventsData.forEach(event => {

            // Parse event date from string to Date object
            const eventDate: Date = new Date(event.eventDate);

            // Check if event date is before the current date
            if (eventDate < currentDate) {

                const colDiv = $("<div>").addClass("col-xl-3 col-lg-4 col-md-6 col-sm-12");
                const thumbnailDiv = $('<div>').addClass('thumbnail-container').css('padding', '10px');
                const thumbnailLink = $('<a>').attr('href', '#').addClass('thumbnail')
                    .attr('data-bs-toggle', 'modal')
                    .attr('data-bs-target', `#lightboxModal${event.eventId}`);
                const thumbnailImg = $('<img>').attr('src', event.eventImage)
                    .addClass('img-fluid')
                    .attr('alt', event.eventName);

                thumbnailLink.append(thumbnailImg);
                thumbnailDiv.append(thumbnailLink);
                colDiv.append(thumbnailDiv);

                colDiv.hide().appendTo(thumbnailsContainer).fadeIn('slow');

                createGalleryModal(event);
            }
        });
    }

    /**
     * Function to create modal for each event.
     * @param event
     */
    function createGalleryModal(event: EventData): void {
        const modalId: string = 'lightboxModal' + event.eventId;
        const modal = document.createElement('div');
        modal.classList.add('modal', 'fade');
        modal.id = modalId;
        modal.tabIndex = -1;
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
        const modalContainer = document.getElementById('modalContainer') as HTMLElement;
        modalContainer.appendChild(modal);
    }
    //endregion

    //region Login Page Functions
    /**
     * Initializes and manages the login page functionality.
     * This function sets up event listeners for the login form, validates user input,
     * and handles the login process by checking against a list of registered users.
     * It displays messages for successful registration, input errors, or invalid credentials.
     */
    function DisplayLoginPage(): void {
        console.log("Called DisplayLoginPage...");

        let userNameField = $("#userName");
        let passwordField = $("#password");

        // Display a success message if coming from a successful registration
        if(sessionStorage.getItem("registered")) {
            $("#messageArea").addClass("alert alert-success").text("Registration successful!").show();
            sessionStorage.removeItem("registered");
        } else {
            $("#messageArea").hide();
        }

        // Login Button Click
        $("#loginButton").on("click", function (): void {

            let validInputs: boolean = false;

            // Reset fields and remove any messages initially
            $("#messageArea").hide();
            RemoveInvalidField(userNameField);
            RemoveInvalidField(passwordField);

            // Validate input fields
            if (ValidateField(userNameField, null) && ValidateField(passwordField, null)) {
                validInputs = true

            } else {

                // Display errors for invalid inputs
                if(!ValidateField(userNameField, null)) {
                    SetInvalidField(userNameField, "Please enter your username.");
                }
                if(!ValidateField(passwordField, null)) {
                    SetInvalidField(passwordField, "Please enter your password.");
                }
            }
            // Proceed if inputs are valid
            if (validInputs) {

                let success: boolean = false;
                let newUser: HarmonyHub.User = new HarmonyHub.User();
                let userName: string = $("#userName").val() as string;
                let password: string = $("#password").val() as string;

                // Attempt to find the user in the registered users list
                $.get("./data/users.json", function(data): void {

                    for (const user of data.users) {

                        if (userName === user.userName && password === user.password) {
                            newUser.fromJSON(user);
                            success = true;
                            break;
                        }
                    }
                    // If credentials are valid, log the user in and redirect
                    if (success) {
                        sessionStorage.setItem("user", newUser.serialize() as string);
                        location.href = "/home";
                    } else {
                        // Reset form and display error message if credentials are invalid
                        ($("#loginForm")[0] as HTMLFormElement).reset();
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
     * Initializes and manages the behavior of the Register Page.
     * It sets up the form validation for the registration process and handles the registration button click event.
     * Upon successful form validation, it stores a registration flag in the sessionStorage and redirects the user
     * to the login page.
     */
    function DisplayRegisterPage(): void {
        console.log("Called DisplayRegisterPage...");

        RegisterFormValidation();

        $("#registerButton").on("click", (): void => {
            if (CheckSubmissionValidity()) {
                sessionStorage.setItem("registered", "true");
                location.href = "/login";
            }
        });
    }

    /**
     * Validates the register form input fields on blur and submission events.
     */
    function RegisterFormValidation(): void {

        let firstNameError: string = "First name should start with a capital letter and can include hyphens, " +
            "apostrophes, or spaces for compound names.";
        let lastNameError: string = "Last name should start with a capital letter and can include hyphens, " +
            "apostrophes, or spaces for compound names.";
        let emailAddressError: string = "Please enter a valid email address in the format: yourname@example.com.";
        let phoneError: string = "Please enter a valid 10-digit phone number, with or without the country code.";
        let addressError: string = "Please enter a valid address in the format: street number, street name, and " +
            "optional unit number (e.g., Apt, Suite, Unit). Include only letters, numbers, spaces, hyphens, or periods.";
        let birthdayError: string = "Please enter a valid birth date in the format: YYYY-MM-DD. The date must be a " +
            "past date.";
        let userNameError: string = "Username should start with a letter and can include letters, numbers, " +
            "underscores, or hyphens, 3 to 16 characters long.";
        let passwordError: string = "Password must be at least 8 characters long, including an uppercase letter, a " +
            "lowercase letter, a number, and a special character.";
        let confirmPasswordError: string = "The password confirmation does not match the password entered.";

        ValidateOnEvent($("#firstName"), "blur", $("#registerButton"),
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, firstNameError);
        ValidateOnEvent($("#lastName"), "blur", $("#registerButton"),
                            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, lastNameError);
        ValidateOnEvent($("#emailAddress"), "blur", $("#registerButton"),
                            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnEvent($("#phone"), "blur", $("#registerButton"),
                            /^\+?1?\d{10}$/, phoneError);
        ValidateOnEvent($("#address"), "blur", $("#registerButton"),
                            /^\d+\s[\w\s.-]+(?:\s?(Apt|Suite|Unit)\s?\d+)?$/, addressError);
        ValidateDateOnEvent($("#birthday"), "blur", $("#registerButton"), birthdayError);
        ValidateOnEvent($("#userName"), "blur", $("#registerButton"),
                            /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/, userNameError);
        ValidateOnEvent($("#password"), "blur", $("#registerButton"),
                            /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, passwordError);
        ConfirmPwOnEvent($("#password"), "blur", $("#registerButton"),
            $("#confirmPassword"), confirmPasswordError);
    }
    //endregion

    //region Careers Page Functions
    /**
     * Called when the Careers page is displayed.
     */
    function DisplayCareersPage(): void {
        console.log("Called DisplayCareersPage...");
    }
    //endregion

    //region Events Planning Page Functions
    /**
     *
     */
    function DisplayEventPlanningPage(): void {
        console.log("Called DisplayEventPlanningPage...")

        InitializeCalendar();
        LoadEventTable();

        $('#eventDescription').on('input', function() {
            const value: string = $(this).val() as string;
            const currentLength: number = value.length;
            const maxLength: number = parseInt($(this).attr('maxlength') || '0');
            $('#charCount').text(`${currentLength}/${maxLength}`);
        });

        EventPlanFormValidation();

        $("#eventFormSubmit").on("click", (): void => {
            if (CheckSubmissionValidity()) {

                const eventName = $("#eventName").val() as string;
                const coordinatorFullName = $("#coordinatorFullName").val() as string;
                const coordinatorEmail = $("#coordinatorEmail").val() as string;
                const coordinatorPhone = $("#coordinatorPhone").val() as string;
                const eventDate = $("#eventDate").val() as string;
                const eventTime = $("#eventTime").val() as string;
                const eventDescription = $("#eventDescription").val() as string;

                AddEvent(eventName, coordinatorFullName, coordinatorEmail, coordinatorPhone,
                    eventDate, eventTime, eventDescription);

                // Close the modal after submission
                const eventPlanningModalEl = document.getElementById('eventPlanningModal');
                if (eventPlanningModalEl) {
                    const eventPlanningModal = bootstrap.Modal.getInstance(eventPlanningModalEl);
                    eventPlanningModal?.hide();
                    location.href = "/event_planning";
                }

            } else {
                // Handle the invalid case
                console.log("Form is not valid.");
            }
        });


    }

    function EventPlanFormValidation(): void {

        let eventNameError: string = "Event name should be between 5 and 30 characters. Numbers are allowed, but not special characters.";
        let coorNameError: string = "First name should start with a capital letter and can include hyphens, " +
            "apostrophes, or spaces for compound names.";
        let coorEmailError: string = "Please enter a valid email address in the format: yourname@example.com.";
        let coorPhoneError: string = "Please enter a valid 10-digit phone number, with or without the country code.";

        ValidateOnEvent($("#eventName"), "blur", $("#eventFormSubmit"),
            /^[A-Za-z0-9 '_-]{5,30}$/, eventNameError);
        ValidateOnEvent($("#coordinatorFullName"), "blur", $("#eventFormSubmit"),
            /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, coorNameError);
        ValidateOnEvent($("#coordinatorEmail"), "blur", $("#eventFormSubmit"),
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, coorEmailError);
        ValidateOnEvent($("#coordinatorPhone"), "blur", $("#eventFormSubmit"),
            /^\+?1?\d{10}$/, coorPhoneError);
    }

    function AddEvent(eventName:string, coordinatorFullName:string, coordinatorEmail:string,coordinatorPhone:string,
                      eventDate:string, eventTime:string, eventDescription:string): void{
        let event = new HarmonyHub.Event(eventName, coordinatorFullName, coordinatorEmail, coordinatorPhone,
            eventDate, eventTime, eventDescription);
        if (event.serialize()) {
            let eventKey = "event_" + event.eventName + "_" + Date.now();
            localStorage.setItem(eventKey, event.serialize() as string);
        }
    }

    function LoadEventTable(){
        if (localStorage.length > 0) {
            let eventList = document.getElementById("eventList") as HTMLElement;
            let data = "";
            let index = 1;

            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith("event_")) { // Check if the key starts with 'event_'
                    let event = new HarmonyHub.Event();
                    let eventData = localStorage.getItem(key) as string;
                    event.deserialize(eventData);

                    // Assuming 'event' object has the properties after being deserialized
                    data += `<tr><th scope="row" class="text-center">${index}</th>
                            <td>${event.eventName}</td>
                            <td>${event.coorFullName}</td>
                            <td>${event.coorEmail}</td>
                            <td>${event.coorPhone}</td>
                            <td>${event.eventDate}</td>
                            <td>${event.eventTime}</td>
                            <td>${event.eventDesc}</td>
                            <td>
                                <button value="${key}" class="btn btn-primary btn-sm edit">
                                    <i class="fas fa-edit fa-sm"></i> Edit
                                </button>
                                <button value="${key}" class="btn btn-danger btn-sm delete">
                                    <i class="fas fa-trash-alt fa-sm"></i> Delete
                                </button>
                            </td>
                         </tr>`;
                    index++;
                }
            }
            eventList.innerHTML = data;

        }

        $("button.delete").on("click", function () {

            if (confirm("Confirm event delete?")){
                localStorage.removeItem($(this).val() as string);
            }
            location.href = "/event_planning";
        });
    }

    //endregion

    //region  Statistics Page Functions
    /**
     *
     */
    function DisplayStatisticsPage(): void {
        console.log("Called DisplayStatisticsPage...");

        HarmonyHub.VisitorDataProcessor.GetVisitorData(function(data): void {

            HarmonyHub.ChartUtils.RenderCountsBarChart(HarmonyHub.VisitorDataProcessor.GetCountsByMonthYear(data));

            $('.nav-tabs .nav-link').on('click', function(): void {
                let activeTabId: string = $(this).attr('id') as string;
                switch (activeTabId) {
                    case 'monthlyData':
                        HarmonyHub.ChartUtils
                            .RenderCountsBarChart(HarmonyHub.VisitorDataProcessor.GetCountsByMonthYear(data));;
                        break;
                    case 'totalVisitorsData':
                        HarmonyHub.ChartUtils
                            .RenderVisitsOverTimeChart(HarmonyHub.VisitorDataProcessor.GetTotalVisitsOverTime(data));
                        break;
                    case 'visitorLocationData':
                        HarmonyHub.ChartUtils
                            .RenderLocationPieChart( HarmonyHub.VisitorDataProcessor.GetLocationCounts(data));
                        break;
                }
            });
        });
    }
    //endregion

    //region Start Function
    /**
     * Called when the website is launched to create the header and footer to display on the page. A switch statement
     * is used to detect which page has been loaded based on the Document Title.
     */
    function Start(): void {
        console.log("App Started");

        let page_id: string|null = $("body")[0].getAttribute("id");

        SetNavbar();

        switch(page_id) {
            case "home":
                DisplayHomePage();
                break;
            case "careers":
                DisplayCareersPage();
                break;
            case "contact":
                DisplayContactPage();
                break;
            case "events":
                DisplayEventsPage();
                break;
            case "gallery":
                DisplayGalleryPage();
                break;
            case "login":
                DisplayLoginPage();
                break;
            case "news":
                DisplayBlogPage();
                break;
            case "portfolio":
                DisplayPortfolioPage();
                break;
            case "privacy_policy":
                DisplayPrivacyPolicyPage();
                break;
            case "register":
                DisplayRegisterPage();
                break;
            case "services":
                DisplayServicesPage();
                break;
            case "team":
                DisplayTeamPage();
                break;
            case "terms_of_service":
                DisplayTermsOfServicePage();
                break;
            case "event_planning":
                AuthGuard();
                DisplayEventPlanningPage();
                break;
            case "statistics":
                AuthGuard();
                DisplayStatisticsPage();
                break;

        }
    }
    //endregion

    window.addEventListener("load", Start);

})();


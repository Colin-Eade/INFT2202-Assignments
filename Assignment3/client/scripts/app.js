"use strict";
function formatDate(dateString) {
    const dateParts = dateString.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10);
    const day = parseInt(dateParts[2], 10);
    const date = new Date(year, month - 1, day);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = monthNames[date.getMonth()];
    return monthName + ' ' + day + ', ' + year;
}
(function () {
    function CheckLogin() {
        return !!sessionStorage.getItem("user");
    }
    function CheckLogout() {
        return !!sessionStorage.getItem("logout");
    }
    function CheckSubmissionValidity() {
        return $(".invalid-field").length <= 0;
    }
    function ValidateField(inputFieldId, regEx) {
        return regEx ? regEx.test($(inputFieldId).val()) : $(inputFieldId).val().trim() !== "";
    }
    function ConfirmPassword(passwordFieldId, confirmPasswordFieldId) {
        return $(passwordFieldId).val() === $(confirmPasswordFieldId).val();
    }
    function ValidateDate(dateFieldId) {
        let date = new Date($(dateFieldId).val());
        let today = new Date();
        today.setHours(0, 0, 0, 0);
        return !(isNaN(date.getTime()) || date > today);
    }
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
    function ConfirmPwOnEvent(passwordFieldId, passwordFieldEvent, submitButtonId, confirmPasswordFieldId, errorMessage) {
        $(confirmPasswordFieldId).on(passwordFieldEvent, () => {
            RemoveInvalidField(confirmPasswordFieldId);
            if (!ConfirmPassword(passwordFieldId, confirmPasswordFieldId)) {
                SetInvalidField(confirmPasswordFieldId, errorMessage);
            }
        });
        $(submitButtonId).on('click', () => {
            RemoveInvalidField(confirmPasswordFieldId);
            if (!ConfirmPassword(passwordFieldId, confirmPasswordFieldId)) {
                SetInvalidField(confirmPasswordFieldId, errorMessage);
            }
        });
    }
    function ValidateDateOnEvent(dateFieldId, dateFieldEvent, submitButtonId, errorMessage) {
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
    function RemoveInvalidField(inputFieldId) {
        if ($(inputFieldId).data('bs.popover')) {
            $(inputFieldId).popover("dispose");
        }
        $(inputFieldId).removeClass("invalid-field");
        $(inputFieldId).next("span").remove();
    }
    function SetInvalidField(inputFieldId, errorMessage) {
        $(inputFieldId).addClass("invalid-field");
        $(inputFieldId).popover({
            content: errorMessage,
            placement: "right",
            trigger: "hover",
            template: '<div class="popover popover-invalid bs-popover-auto fade show">' +
                '<div class="popover-body popover-body-invalid"></div>' +
                '</div>'
        });
        $(inputFieldId).after('<span class="input-group-text bg-danger text-white">' +
            '<i class="fa-regular fa-circle-xmark"></i>' +
            '</span>');
    }
    function SetNavbar() {
        SetActiveLink();
        NavBarSearch();
        if (CheckLogin()) {
            SetLoggedInNavBar();
            SetWelcomeMessage();
        }
        else if (CheckLogout()) {
            SetLogoutMessage();
        }
    }
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
        navSearchInput.on("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
        navSearchInput.on("keyup", function () {
            let searchTerm = $(this).val().toLowerCase();
            navSearchDropdown.empty();
            if (searchTerm.length <= 2) {
                navSearchDropdown.hide();
            }
            else {
                navSearchDropdown.show();
                $.get('./data/data_dump.json', function (data) {
                    let matchFound = false;
                    for (const page of data.pages) {
                        let textContent = page.content;
                        let lowerCaseContent = textContent.toLowerCase();
                        let index = lowerCaseContent.indexOf(searchTerm);
                        if (index !== -1) {
                            matchFound = true;
                            if (firstResultUrl === null) {
                                firstResultUrl = page.URL;
                            }
                            let start = Math.max(index - 20, 0);
                            let end = Math.min(index + searchTerm.length + 20, textContent.length);
                            let snippetStart = start > 0 ? "..." : "";
                            let snippetEnd = end < textContent.length ? "..." : "";
                            let searchSnippet = snippetStart + textContent.substring(start, end).trim() + snippetEnd;
                            if (navSearchDropdown.children().length < 5) {
                                let filename = page.URL.split('/').pop();
                                let listItem = `
                                            <a class="dropdown-item d-flex justify-content-between align-items-center me-5" href="${page.URL}">
                                                <span>${searchSnippet}</span>
                                                <span class="small text-secondary">${filename}</span>
                                            </a>`;
                                navSearchDropdown.append(listItem).show();
                            }
                        }
                    }
                    if (!matchFound) {
                        navSearchDropdown.append('<span class="dropdown-item">No results found</span>').show();
                    }
                });
            }
        });
    }
    function SetActiveLink() {
        let noPrefixTitle = document.title.replace("Harmony Hub - ", "");
        $(`li>a:contains(${noPrefixTitle})`).addClass("active");
    }
    function SetLoggedInNavBar() {
        let userData = sessionStorage.getItem("user");
        if (userData) {
            let user = new HarmonyHub.User();
            user.deserialize(userData);
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
                    <li><a id="navLogoutLink" class="dropdown-item" href="#">Logout</a></li>
                </ul>`);
        }
        else {
            $("#navUserButton").after(`
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="navUserButton">
                    <li><a id="navLogoutLink" class="dropdown-item" href="#">Logout</a></li>
                </ul>`);
        }
        $("#navLogoutLink").on("click", () => {
            sessionStorage.clear();
            location.href = "/login";
            sessionStorage.setItem("logout", "true");
        });
    }
    function SetWelcomeMessage() {
        if (!sessionStorage.getItem("welcomed")) {
            let userData = sessionStorage.getItem("user");
            if (userData) {
                let user = new HarmonyHub.User();
                user.deserialize(userData);
                $("#navUserButton").closest("li")
                    .before(`
                            <li class="nav-item" id="navMessageWrapper">
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
    function SetLogoutMessage() {
        $("#navLoginLink").closest("li")
            .before(`
                     <li class="nav-item" id="navMessageWrapper">
                         <span id="navMessage" class="nav-link">
                             Logout successful!
                         </span>
                     </li>`);
        sessionStorage.removeItem("logout");
        setTimeout(() => {
            $("#navMessageWrapper").remove();
        }, 6000);
    }
    function DisplayHomePage() {
        console.log("Called DisplayHomePage...");
        let page = 1;
        let searchInput = "CBC News";
        $("#newsSearchInput").on('keydown', function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
        GNewsAPIFetch(searchInput, page);
        $("#newsSearchButton").on("click", () => {
            searchInput = $("#newsSearchInput").val();
            page = 1;
            $("#homeArticleArea").empty();
            GNewsAPIFetch(searchInput, page);
        });
        $("#newsScrollDownButton").on("click", () => {
            page++;
            $("#homeArticleArea").empty();
            GNewsAPIFetch(searchInput, page);
        });
        $("#newsScrollUpButton").on("click", () => {
            page--;
            $("#homeArticleArea").empty();
            GNewsAPIFetch(searchInput, page);
        });
    }
    function GNewsAPIFetch(keywords, page) {
        const pageSize = 3;
        const language = "en";
        const key = "ba7d1c40045850f7ee5b6113b2728729";
        let url = `https://gnews.io/api/v4/search?q=${keywords}&max=${pageSize}&page=${page}&lang=${language}&apikey=${key}`;
        ShowPlaceholder();
        $.get(url, function (data) {
            GNewsAPIFetchSuccess(data, page, pageSize);
        }).fail(GNewsAPIFail);
    }
    function ShowPlaceholder() {
        let placeholdersHtml = '';
        for (let i = 0; i < 3; i++) {
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
        let loadingHtml = `<div id="placeholder">${placeholdersHtml}</div>`;
        $('#homeArticleArea').html(loadingHtml);
    }
    function GNewsAPIFetchSuccess(data, page, pageSize) {
        $("#placeholder").remove();
        let scrollDownButton = $("#newsScrollDownButton");
        let scrollUpButton = $("#newsScrollUpButton");
        if (data.totalArticles) {
            scrollDownButton.removeClass("disabled");
            scrollUpButton.removeClass("disabled");
            let maxPages = Math.ceil(data.totalArticles / pageSize);
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
                             | ${article.source.url || "No source URL"}
                        </p>
                        <p class="mb-1">${article.description || "No description"}</p>
                    </a>`;
                $('#homeArticleArea').append(articleHtml);
            }
        }
        else {
            scrollDownButton.addClass("disabled");
            scrollUpButton.addClass("disabled");
            let articleHtml = `
                    <div class="list-group-item mt-1">
                        <p class="mb-1">No articles to display. Please try another search.</p>
                    </div>`;
            $('#homeArticleArea').append(articleHtml);
        }
    }
    function GNewsAPIFail(data) {
        $("#placeholder").remove();
        console.log(data);
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
        }
        else if (data.responseJSON && data.responseJSON.errors) {
            if (Array.isArray(data.responseJSON.errors)) {
                for (const error of data.responseJSON.errors) {
                    errorHtml += `<p class="mb-1">${error}</p>`;
                }
            }
            else {
                errorHtml += `<p class="mb-1">${data.responseJSON.errors.q}</p>`;
            }
        }
        else {
            `<p class="mb-1">An unexpected error occurred. Please try again later.</p>`;
        }
        errorHtml += `</div>`;
        $('#homeArticleArea').append(errorHtml);
    }
    function DisplayPortfolioPage() {
        console.log("Called DisplayPortfolioPage...");
        const projectContainer = document.getElementById("project-container");
        const loadMoreButton = document.getElementById("load-more-button");
        function displayProjects(projects, startIndex, endIndex) {
            for (let i = startIndex; i < endIndex && i < projects.length; i++) {
                if (!projects[i].displayed) {
                    const projectCard = createProjectCard(projects[i]);
                    projectContainer.appendChild(projectCard);
                    projects[i].displayed = true;
                }
            }
        }
        function loadProjects() {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/projects.json', true);
            xhr.onload = function () {
                if (this.status === 200) {
                    const response = JSON.parse(this.responseText);
                    const projects = response.projects;
                    projects.forEach(project => project.displayed = false);
                    let startIndex = 0;
                    const projectsPerPage = 2;
                    displayProjects(projects, startIndex, startIndex + projectsPerPage);
                    startIndex += projectsPerPage;
                    loadMoreButton.addEventListener("click", function handleLoadMore() {
                        if (startIndex < projects.length) {
                            displayProjects(projects, startIndex, startIndex + projectsPerPage);
                            startIndex += projectsPerPage;
                        }
                        else {
                            loadMoreButton.disabled = true;
                        }
                    });
                }
                else {
                    console.error("Failed to load projects:", this.statusText);
                }
            };
            xhr.onerror = function () {
                console.error("Request failed");
            };
            xhr.send();
        }
        loadProjects();
    }
    function createProjectCard(project) {
        const col = document.createElement("div");
        col.classList.add("col", "d-flex", "justify-content-center");
        const card = document.createElement("div");
        card.classList.add("card");
        card.style.maxWidth = "500px";
        const image = document.createElement("img");
        image.classList.add("card-img-top");
        image.src = project.imageSrc;
        image.alt = project.title;
        image.style.maxWidth = "500px";
        image.style.maxHeight = "200px";
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        const title = document.createElement("h5");
        title.classList.add("card-title");
        title.textContent = project.title;
        const description = document.createElement("p");
        description.classList.add("card-text");
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
    function DisplayServicesPage() {
        console.log("Called DisplayServicesPage...");
    }
    function DisplayTeamPage() {
        console.log("Called DisplayTeamPage...");
    }
    function DisplayBlogPage() {
        console.log("Called DisplayContactListPage...");
        let blogPageHeading = document.getElementsByTagName("h1")[0];
        blogPageHeading.textContent = "Community News";
        document.title = "Harmony Hub - News";
    }
    function DisplayContactPage() {
        console.log("Called DisplayContactPage...");
        FeedbackCard();
        ContactFormValidation();
        let submitButton = document.getElementById('formSubmit');
        let modalSubmit = document.getElementById("modalSubmit");
        let contactForm = document.getElementById("contactForm");
        let contactModal = new bootstrap.Modal(document.getElementById('contactModal'));
        let redirectModal = new bootstrap.Modal(document.getElementById('redirectModal'));
        submitButton.addEventListener("click", (event) => {
            if (CheckSubmissionValidity()) {
                SubmitContactForm(event);
            }
        });
        modalSubmit.addEventListener("click", SubmitModalSubmitClick);
        function SubmitContactForm(event) {
            event.preventDefault();
            PopulateSubmitModal();
            contactModal.show();
        }
        function PopulateSubmitModal() {
            let formFullName = document.getElementById("fullName").value;
            let formEmailAddress = document.getElementById("emailAddress").value;
            let formSubject = document.getElementById("subject").value;
            let formMessage = document.getElementById("message").value;
            let modalFullName = document.getElementById("modalFullName");
            let modalEmailAddress = document.getElementById("modalEmailAddress");
            let modalSubject = document.getElementById("modalSubject");
            let modalMessage = document.getElementById("modalMessage");
            modalFullName.textContent = formFullName;
            modalEmailAddress.textContent = formEmailAddress;
            modalSubject.textContent = formSubject;
            modalMessage.textContent = formMessage;
        }
        function SubmitModalSubmitClick() {
            contactModal.hide();
            contactForm.reset();
            RedirectModalCountdown();
            redirectModal.show();
        }
        function RedirectModalCountdown() {
            _.delay(RedirectToHome, 5500);
            let counter = 5;
            let counterDisplay = document.getElementById("redirectCounter");
            counterDisplay.textContent = counter.toString();
            let interval = setInterval(function () {
                counter--;
                counterDisplay.textContent = counter.toString();
                if (counter <= 0) {
                    clearInterval(interval);
                    redirectModal.hide();
                }
            }, 1000);
        }
        function RedirectToHome() {
            window.location.href = "/index";
        }
    }
    function ContactFormValidation() {
        let fullNameError = "Please enter your full name, starting each part with a capital letter. " +
            "You can include spaces, hyphens, and apostrophes if necessary.";
        let emailAddressError = "Please enter a valid email address in the format: yourname@example.com.";
        let messageError = "Your message cannot be empty. Please provide details so we can assist you better.";
        ValidateOnEvent($("#fullName"), "blur", $("#formSubmit"), /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)+$/, fullNameError);
        ValidateOnEvent($("#emailAddress"), "blur", $("#formSubmit"), /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnEvent($("#message"), "blur", $("#formSubmit"), null, messageError);
    }
    function FeedbackCard() {
        let feedbackMessage = $("#feedBackMessage");
        let feedbackDropdown = $("#feedBackDropdown");
        let feedbackForm = $("#feedBackForm");
        let feedbackBody = $("#feedBackBody");
        feedbackForm.show();
        feedbackMessage.hide();
        feedbackDropdown.remove("invalid-field");
        feedbackForm.on('keydown', function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
            }
        });
        $("#feedbackSubmit").on("click", () => {
            if (feedbackDropdown.val() === "0") {
                feedbackDropdown.addClass("invalid-field");
                feedbackMessage.addClass("alert alert-danger")
                    .text("Please select a rating before submitting your feedback.").show();
            }
            else {
                $.get("./data/feedback_responses.json", function (data) {
                    let response = data[feedbackDropdown.val()];
                    if ($("#feedBackComment").val().trim() !== "") {
                        response += " " + data.commentResponse;
                    }
                    feedbackBody.fadeOut("slow", function () {
                        feedbackForm.hide();
                        feedbackMessage.removeClass("alert-danger").addClass("alert alert-success")
                            .text(response).show();
                        feedbackBody.fadeIn("slow");
                    });
                }).fail(() => {
                    let genericResponse = "Thank you for your feedback.";
                    feedbackBody.fadeOut("slow", function () {
                        feedbackForm.hide();
                        feedbackMessage.removeClass("alert-danger").addClass("alert alert-success")
                            .text(genericResponse).show();
                        feedbackBody.fadeIn("slow");
                    });
                });
            }
        });
    }
    function DisplayPrivacyPolicyPage() {
        console.log("Called DisplayPrivacyPolicyPage...");
    }
    function DisplayTermsOfServicePage() {
        console.log("Called DisplayTermsOfServicePage...");
    }
    function DisplayEventsPage() {
        console.log("Called DisplayEventsPage...");
        $(function () {
            $('.dropdown-item').on('click', function () {
                let filterOption = $(this).text().toLowerCase().trim();
                displayEventCards(filterOption);
            });
            displayEventCards('upcoming');
        });
    }
    function displayEventCards(filterOption) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './data/events.json', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let eventsData = JSON.parse(xhr.responseText).events;
                let filteredEvents = filterEvents(eventsData, filterOption);
                filteredEvents.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
                const eventsContainer = $("#events-container");
                eventsContainer.empty();
                filteredEvents.forEach(event => {
                    const eventCard = createEventCard(event);
                    eventCard.hide();
                    eventsContainer.append(eventCard);
                    eventCard.fadeIn('slow');
                });
            }
            else {
                console.error('Error fetching JSON data:', xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.error('Error fetching JSON data:', xhr.statusText);
        };
        xhr.send();
    }
    function createEventCard(event) {
        const colDiv = $("<div>").addClass("col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex");
        const card = $("<div>").addClass("card").css("margin", "5px");
        const cardImage = $("<img>").addClass("card-img-top").attr("src", event.eventImage).attr("alt", event.eventName);
        const cardBody = $("<div>").addClass("card-body");
        const title = $("<h5>").addClass("card-title").text(event.eventName);
        const date = $("<p>").addClass("card-text").text("Date: " + formatDate(event.eventDate));
        const location = $("<p>").addClass("card-text").text("Location: " + event.eventLocation);
        const description = $("<p>").addClass("card-text").text(event.eventDescription);
        card.append(cardImage, cardBody);
        cardBody.append(title, date, location, description);
        colDiv.append(card);
        return colDiv;
    }
    function filterEvents(events, filterOption) {
        if (filterOption === 'upcoming') {
            return events.filter(event => new Date(event.eventDate) > new Date());
        }
        else if (filterOption === 'past') {
            return events.filter(event => new Date(event.eventDate) < new Date());
        }
        else {
            return events;
        }
    }
    function DisplayGalleryPage() {
        console.log("Called DisplayGalleryPage...");
        loadGalleryThumbnails('newest first');
        $('.dropdown-item').on('click', function () {
            const sortOption = $(this).text().toLowerCase().trim();
            loadGalleryThumbnails(sortOption);
        });
    }
    function loadGalleryThumbnails(sortOption) {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', './data/events.json', true);
        xhr.onload = function () {
            if (xhr.status === 200) {
                let eventsData = JSON.parse(xhr.responseText).events;
                if (sortOption === 'newest first') {
                    eventsData.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime());
                }
                else if (sortOption === 'oldest first') {
                    eventsData.sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
                }
                createGalleryThumbnails(eventsData);
            }
            else {
                console.error('Error fetching JSON data:', xhr.statusText);
            }
        };
        xhr.onerror = function () {
            console.error('Error fetching JSON data:', xhr.statusText);
        };
        xhr.send();
    }
    function createGalleryThumbnails(eventsData) {
        const thumbnailsContainer = $('#thumbnails');
        thumbnailsContainer.empty();
        const currentDate = new Date();
        eventsData.forEach(event => {
            const eventDate = new Date(event.eventDate);
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
    function createGalleryModal(event) {
        const modalId = 'lightboxModal' + event.eventId;
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
        const modalHeader = document.createElement('div');
        modalHeader.classList.add('modal-header');
        const modalTitle = document.createElement('h5');
        modalTitle.classList.add('modal-title');
        modalTitle.textContent = event.eventName;
        modalHeader.appendChild(modalTitle);
        modalContent.appendChild(modalHeader);
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
        const modalContainer = document.getElementById('modalContainer');
        modalContainer.appendChild(modal);
    }
    function DisplayLoginPage() {
        console.log("Called DisplayLoginPage...");
        let userNameField = $("#userName");
        let passwordField = $("#password");
        if (sessionStorage.getItem("registered")) {
            $("#messageArea").addClass("alert alert-success").text("Registration successful!").show();
            sessionStorage.removeItem("registered");
        }
        else {
            $("#messageArea").hide();
        }
        $("#loginButton").on("click", function () {
            let validInputs = false;
            $("#messageArea").hide();
            RemoveInvalidField(userNameField);
            RemoveInvalidField(passwordField);
            if (ValidateField(userNameField, null) && ValidateField(passwordField, null)) {
                validInputs = true;
            }
            else {
                if (!ValidateField(userNameField, null)) {
                    SetInvalidField(userNameField, "Please enter your username.");
                }
                if (!ValidateField(passwordField, null)) {
                    SetInvalidField(passwordField, "Please enter your password.");
                }
            }
            if (validInputs) {
                let success = false;
                let newUser = new HarmonyHub.User();
                let userName = $("#userName").val();
                let password = $("#password").val();
                $.get("./data/users.json", function (data) {
                    for (const user of data.users) {
                        if (userName === user.userName && password === user.password) {
                            newUser.fromJSON(user);
                            success = true;
                            break;
                        }
                    }
                    if (success) {
                        sessionStorage.setItem("user", newUser.serialize());
                        location.href = "/home";
                    }
                    else {
                        $("#loginForm")[0].reset();
                        $("#messageArea").addClass("alert alert-danger")
                            .text("Invalid credentials. Please try again.").show();
                    }
                });
            }
        });
    }
    function DisplayRegisterPage() {
        console.log("Called DisplayRegisterPage...");
        RegisterFormValidation();
        $("#registerButton").on("click", () => {
            if (CheckSubmissionValidity()) {
                sessionStorage.setItem("registered", "true");
                location.href = "/login";
            }
        });
    }
    function RegisterFormValidation() {
        let firstNameError = "First name should start with a capital letter and can include hyphens, " +
            "apostrophes, or spaces for compound names.";
        let lastNameError = "Last name should start with a capital letter and can include hyphens, " +
            "apostrophes, or spaces for compound names.";
        let emailAddressError = "Please enter a valid email address in the format: yourname@example.com.";
        let phoneError = "Please enter a valid 10-digit phone number, with or without the country code.";
        let addressError = "Please enter a valid address in the format: street number, street name, and " +
            "optional unit number (e.g., Apt, Suite, Unit). Include only letters, numbers, spaces, hyphens, or periods.";
        let birthdayError = "Please enter a valid birth date in the format: YYYY-MM-DD. The date must be a " +
            "past date.";
        let userNameError = "Username should start with a letter and can include letters, numbers, " +
            "underscores, or hyphens, 3 to 16 characters long.";
        let passwordError = "Password must be at least 8 characters long, including an uppercase letter, a " +
            "lowercase letter, a number, and a special character.";
        let confirmPasswordError = "The password confirmation does not match the password entered.";
        ValidateOnEvent($("#firstName"), "blur", $("#registerButton"), /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, firstNameError);
        ValidateOnEvent($("#lastName"), "blur", $("#registerButton"), /^[A-Z][a-z]+(?:[ '-][A-Z][a-z]+)*$/, lastNameError);
        ValidateOnEvent($("#emailAddress"), "blur", $("#registerButton"), /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/, emailAddressError);
        ValidateOnEvent($("#phone"), "blur", $("#registerButton"), /^\+?1?\d{10}$/, phoneError);
        ValidateOnEvent($("#address"), "blur", $("#registerButton"), /^\d+\s[\w\s.-]+(?:\s?(Apt|Suite|Unit)\s?\d+)?$/, addressError);
        ValidateDateOnEvent($("#birthday"), "blur", $("#registerButton"), birthdayError);
        ValidateOnEvent($("#userName"), "blur", $("#registerButton"), /^[a-zA-Z][a-zA-Z0-9_-]{2,15}$/, userNameError);
        ValidateOnEvent($("#password"), "blur", $("#registerButton"), /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, passwordError);
        ConfirmPwOnEvent($("#password"), "blur", $("#registerButton"), $("#confirmPassword"), confirmPasswordError);
    }
    function DisplayCareersPage() {
        console.log("Called DisplayCareersPage...");
    }
    function Start() {
        console.log("App Started");
        let page_id = $("body")[0].getAttribute("id");
        SetNavbar();
        switch (page_id) {
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
        }
    }
    window.addEventListener("load", Start);
})();
//# sourceMappingURL=app.js.map
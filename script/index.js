//Get scholarship data from scholarships.json

SCHOLARSHIP_DATA = []

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

readTextFile("scholarships.json", function (text) {
    var data = JSON.parse(text);
    SCHOLARSHIP_DATA = data;

    onLoad();
});

UNI_ICONS = {
    "Aus: University of Melbourne": "melb.png",
    "Aus: University of Sydney": "sydney.png",
    "AUT": "aut.png",
    "Lincoln University": "lincoln.png",
    "MIT": "mit.png",
    "Other (KiwiRail)": "kiwirail.png",
    "Other (Universities NZ)": "unz.png",
    "Other (One Choice)": "onechoice.png",
    "UK: Cambridge University": "cambridge.png",
    "University of Auckland": "uoa.png",
    "University of Canterbury": "uc.png",
    "University of Otago": "otago.png",
    "University of Waikato": "waikato.png",
    "US: Duke University and UNC-Chapel Hil": "duke.png",
    "Victoria University of Wellington": "victoria.png"
}

const today = new Date()

function openState(scholarship) {
    const open_date = scholarship['open_date']
    const close_date = scholarship['close_date']

    //If 2022 is in the closing date, return "unclear"

    if (close_date != null && close_date.includes("2022")) {
        return "unclear"
    }

    const open_now = open_date === "Open Now"

    if (open_now) {
        //Try parse closing date as Y-M-D
        if (close_date == null) return "open";
        if (!close_date.includes("-")) return "open";
        const close_date_split = close_date.split("-")
        const close_date_obj = new Date(close_date_split[0], close_date_split[1] - 1, close_date_split[2])

        if (today <= close_date_obj) {
            return "open"
        } else {
            return "closed"
        }
    }

    const open_date_is_date = open_date != null && open_date.includes("-")
    const close_date_is_date = close_date != null && close_date.includes("-")

    if (open_date_is_date && close_date_is_date) {
        const open_date_split = open_date.split("-")
        const open_date_obj = new Date(open_date_split[0], open_date_split[1] - 1, open_date_split[2])

        const close_date_split = close_date.split("-")
        const close_date_obj = new Date(close_date_split[0], close_date_split[1] - 1, close_date_split[2])

        if (today >= open_date_obj && today <= close_date_obj) {
            return "open"
        } else {
            return "closed"
        }
    } else if (open_date_is_date) {
        const open_date_split = open_date.split("-")
        const open_date_obj = new Date(open_date_split[0], open_date_split[1] - 1, open_date_split[2])

        if (today >= open_date_obj) {
            return "open"
        } else {
            return "closed"
        }
    } else if (close_date_is_date) {
        const close_date_split = close_date.split("-")
        const close_date_obj = new Date(close_date_split[0], close_date_split[1] - 1, close_date_split[2])

        if (today <= close_date_obj) {
            return "open"
        } else {
            return "closed"
        }
    } else {
        return "unclear"
    }
}

function makeCard(scholarship) {
    open_state = openState(scholarship)

    var card = document.createElement('div');
    var main_info = document.createElement('div');
    card.className = `scholarship_card open_state_${open_state}`

    title = scholarship["name"]
    offered_by = scholarship["offered_by"]

    //Remove trailing and leading whitespace
    title = title.trim()
    offered_by = offered_by.trim()

    title_element = document.createElement('h1');
    title_element.className = "scholarship_title"
    title_element.innerText = title

    offered_by_element = document.createElement('h2');
    offered_by_element.className = "scholarship_offered_by"

    offered_by_element.className = "scholarship_offered_by"
    offered_by_element.innerText = `${offered_by}`

    //card.appendChild(title_element)
    //card.appendChild(offered_by_element)
    main_info.appendChild(title_element)
    main_info.appendChild(offered_by_element)
    main_info.className = "scholarship_main_info"

    if (offered_by in UNI_ICONS) {
        icon = document.createElement('img');
        icon.className = "scholarship_icon"
        icon.src = `uni_icons/${UNI_ICONS[offered_by]}`
        main_info.appendChild(icon)
    }

    card.appendChild(main_info)

    extra = makeExtraInfo(scholarship);
    card.appendChild(extra);

    //Make extra info appear when card is clicked
    card.onclick = function () {
        //Find the extra in the card
        extra = card.getElementsByClassName("scholarship_extra_info")[0]

        if (extra.style.display == "block") {
            extra.style.display = "none"
        } else {
            extra.style.display = "block"
        }
    }

    card.setAttribute("offerer", offered_by)
    card.setAttribute("subjects", scholarship["applicable_subjects"].join("|"))

    return card
}

function makeTime(t) {
    res = t["value"] + " " + t["type"]

    if (t["value"] != 1) {
        res += "s"
    }

    return res
}

const CARDS = []

function makeExtraInfo(scholarship) {
    extra_info = document.createElement('div');

    if (scholarship["link"] != null) {
        link = document.createElement('a');
        link.className = "scholarship_link"
        link.href = scholarship["link"]
        link.innerText = "View Scholarship"
        extra_info.appendChild(link)
    }

    if (scholarship["applicable_subjects"].length != 0) {
        applicable_subjects = document.createElement('div')
        applicable_subjects.className = "scholarship_applicable_subjects"

        applicable_subjects_title = document.createElement('h4')
        applicable_subjects_title.style = "margin-bottom: 0px;"
        applicable_subjects_title.innerText = "Applicable Subjects"
        applicable_subjects.appendChild(applicable_subjects_title)

        applicable_subjects_list = document.createElement('ul')
        for (subject of scholarship["applicable_subjects"]) {
            subject_element = document.createElement('li')
            subject_element.innerText = subject
            applicable_subjects_list.appendChild(subject_element)
        }
        applicable_subjects.appendChild(applicable_subjects_list)

        extra_info.appendChild(applicable_subjects)
    }

    if (scholarship["student_requirements"].length != 0) {
        student_requirements = document.createElement('div')
        student_requirements.className = "scholarship_student_requirements"

        student_requirements_title = document.createElement('h4')
        student_requirements_title.style = "margin-bottom: 0px;"
        student_requirements_title.innerText = "Student Requirements"
        student_requirements.appendChild(student_requirements_title)

        student_requirements_list = document.createElement('ul')
        for (requirement of scholarship["student_requirements"]) {
            requirement_element = document.createElement('li')
            requirement_element.innerText = requirement
            student_requirements_list.appendChild(requirement_element)
        }

        student_requirements.appendChild(student_requirements_list)

        extra_info.appendChild(student_requirements)
    }

    value_info = document.createElement('div')
    value_info.className = "scholarship_value_info"

    value_info_title = document.createElement('h4')
    value_info_title.style = "margin-bottom: 0px;"
    value_info_title.innerText = "Value"
    value_info.appendChild(value_info_title)

    value_info_list = document.createElement('ul')

    if (scholarship['value']['tuition'] != null && scholarship['value']['tuition']['value'] != 0) {
        tuition_element = document.createElement('li')
        tuition_element.innerText = `${makeTime(scholarship['value']['tuition'])} of tuition`
        value_info_list.appendChild(tuition_element)
    }

    if (scholarship['value']['accommodation'] != null && scholarship['value']['accommodation']['value'] != 0) {
        accommodation_element = document.createElement('li')
        accommodation_element.innerText = `${makeTime(scholarship['value']['accommodation'])} of accommodation`
        value_info_list.appendChild(accommodation_element)
    }

    if (scholarship['value']['value']['value'] != 0) {
        value_element = document.createElement('li')
        value_element.innerText = "$" + scholarship['value']['value']['value']
        value_info_list.appendChild(value_element)
    }

    for (other_value of scholarship['value']['extra']) {
        other_value_element = document.createElement('li')
        other_value_element.innerText = other_value
        value_info_list.appendChild(other_value_element)
    }

    value_info.appendChild(value_info_list)

    open_data_element = document.createElement('p')
    open_data_element.innerText = `Open: ${scholarship['open_date']} - Close: ${scholarship['close_date']}`
    value_info.appendChild(open_data_element)

    extra_info.appendChild(value_info)
    extra_info.className = "scholarship_extra_info"

    extra_info.style = "display: none;"

    return extra_info;
}


function appendHtml(el, str) {
  var div = document.createElement("div");
  div.innerHTML = str;
  while (div.children.length > 0) {
    el.appendChild(div.children[0]);
  }
}


function cleanID(id) {
    id = id.toUpperCase();
    id = id.replace( /\t/ , "T");
    id = id.replace( /\n/ , "N");
    id = id.replace( /\r/ , "R");
    id = id.replace( /\b/ , "B");
    id = id.replace( /\f/ , "F");
    return id.replace( /[^a-zA-Z0-9]/ , "");
}

function updateFilters() {
    offerers = document.getElementById("offerer_filter").getElementsByClassName("dropdown-content")[0].getElementsByClassName("filter-selected");
    offerers = Array.from(offerers).map(x => x.innerText);

    subjects = document.getElementById("subject_filter").getElementsByClassName("dropdown-content")[0].getElementsByClassName("filter-selected");
    subjects = Array.from(subjects).map(x => x.innerText);


    current_filters = document.getElementById("tag-list");
    current_filters.innerHTML = "";

    filter_list = document.getElementsByClassName('filter-selected');  

    for (filter of filter_list) {
        filter.id = cleanID(filter.attributes.for.value);
        appendHtml(
          current_filters,
          `<div class="tag" onclick="{document.getElementById('${filter.id}').className = 'filter-not-selected';updateFilters()}">${filter.innerText}</div>`
        );


        // new_tag = document.createElement("div");
        // new_tag.className = "tag";
        // new_tag.onclick = `function() {

        //     filter.className = "filter-not-selected";
        //     console.log("clicked", filter.className);
        //     updateFilters();
        // }`

        // new_tag.innerText = filter.attributes.for.value;
        // current_filters.appendChild(
        //     new_tag
        // );

    }

    // sortList(current_filters);

    for (card of CARDS) {
        let displayed = true;

        if (offerers.length != 0 && !offerers.includes(card.getAttribute("offerer"))) {
            displayed = false;
        }

        if (subjects.length != 0) {
            const cardSubjects = card.getAttribute("subjects").split("|");
            if (cardSubjects.length == 1 && cardSubjects[0] == "") {

            } else {
                let found = false;
                for (subject of subjects) {
                    if (cardSubjects.includes(subject)) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    displayed = false;
                }
            }
        }

        if (displayed) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    }
}

function onLoad() {
    for (scholarship of SCHOLARSHIP_DATA) {
        let card = makeCard(scholarship);
        document.getElementById("scholarship_list").appendChild(card);
        CARDS.push(card);
    }

    allOfferers = new Set();
    allSubjects = new Set();
    for (scholarship of SCHOLARSHIP_DATA) {
        allOfferers.add(scholarship["offered_by"])
        scholarship["applicable_subjects"].forEach(x => allSubjects.add(x));
    }

    


    const offerFilter = document.getElementById("offerer_filter");
    const dropdownContent = offerFilter.getElementsByClassName("dropdown-content")[0];
    for (offerer of allOfferers) {
        const element = document.createElement("div");
        element.innerText = offerer;
        element.classList.add("filter-not-selected");
        element.setAttribute("for", offerer);
        element.setAttribute("selected", "false");

        element.onclick = function () {
            if (this.getAttribute("selected") == "false") {
                this.classList.remove("filter-not-selected");
                this.classList.add("filter-selected");
                this.setAttribute("selected", "true");
            } else {
                this.classList.remove("filter-selected");
                this.classList.add("filter-not-selected");
                this.setAttribute("selected", "false");
            }

            updateFilters();
        }

        dropdownContent.appendChild(element);
    }

    sortList(dropdownContent);

    const subjectFilter = document.getElementById("subject_filter");
    const subjectDropdownContent = subjectFilter.getElementsByClassName("dropdown-content")[0];


    for (subject of allSubjects) {
        const element = document.createElement("div");
        element.innerText = subject;
        element.classList.add("filter-not-selected");
        element.setAttribute("for", subject);
        element.setAttribute("selected", "false");

        element.onclick = function () {
            if (this.classList.contains("filter-not-selected")) {
                this.classList.remove("filter-not-selected");
                this.classList.add("filter-selected");
                this.setAttribute("selected", "true");
            } else {
                this.classList.remove("filter-selected");
                this.classList.add("filter-not-selected");
                this.setAttribute("selected", "false");
            }

            updateFilters();
        }

        subjectDropdownContent.appendChild(element);
    }
    sortList(subjectDropdownContent);

}


function 
sortList(list) {
  var list, i, switching, b, shouldSwitch;
  switching = true;
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    b = list.getElementsByTagName("div");
    // Loop through all list items:
    for (i = 0; i < b.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Check if the next item should
      switch place with the current item: */
      if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
        /* If next item is alphabetically lower than current item,
        mark as a switch and break the loop: */
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark the switch as done: */
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}

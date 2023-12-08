//createElemWithText function
function createElemWithText(stringName = "p", textContent = "", className) {
    const name = document.createElement(stringName);
    name.textContent = textContent;
    
    if(className) {
        name.className = className;
    }
    return name;
    }
    
    //createSelectOPtions function
    function createSelectOptions(allUsers) {
        const selectors = [];
    
        if(!allUsers){
            return undefined;
        }
        for (const user of allUsers) {
            const option = document.createElement('option');
    
            option.value = user.id;
    
            option.textContent = user.name;
    
            selectors.push(option);
        }
        return selectors;
    }
    //toggleCommentSection function
    function toggleCommentSection(postId) {
        commSect = document.querySelector(`section[data-post-id="${postId}"]`);
        if(commSect) {
            commSect.classList.toggle('hide')
            return commSect;
        }
        if(!postId) {
            return undefined;
        }
        if(!commSect) {
            return null
        }
    }
    //toggleCommentButton function
    function toggleCommentButton(postId) {
        const commButtton = document.querySelector(`button[data-post-id="${postId}"]`);
        if (!postId) {
            return undefined
        }
        if (commButtton) {
            commButtton.textContent = commButtton.textContent.trim() === 'Show Comments' ? 'Hide Comments' : 'Show Comments';
        }
        return commButtton
    }
    
    //deleteChildElements function
    function deleteChildElements(parentElement) {
    
        if (!parentElement || !(parentElement instanceof HTMLElement)) {
            return undefined;
        }
    
        let childvar = parentElement.lastElementChild;
       
    
        while (childvar) {
            parentElement.removeChild(childvar);
            childvar =  parentElement.lastElementChild;
        }
        return parentElement;
    
    }
    
    //////////////////////////////
    
    //empty functions needed
    function toggleComments(event, postId) {
        if(!event && !postId){
            return undefined
        }
        event.target.listener = true;
    
        const section = toggleCommentSection(postId);
        const button = toggleCommentButton(postId);
    
        return [section, button];
    }
    //addButtonListeners function
    function addButtonListeners() {
        const buttons = document.querySelectorAll('main button');
        if (buttons) {
            buttons.forEach(button => {
                const postId = button.dataset.postId;
                if (postId) {
                    button.addEventListener('click', (event) => toggleComments(event, postId));
                }
            });
        }
        return buttons;
    }
    //removeButtonListeners function
    function removeButtonListeners() {
        const buttons = document.querySelectorAll('main button');
        buttons.forEach(button => {
            const postId = button.dataset.postId;
            if (postId) {
                button.removeEventListener('click', (event) => toggleComments(event, postId));
            }
        });
        return buttons;
    }
    //createComments function
    function createComments(commentsData) {
        const fragment = document.createDocumentFragment();
        if (!commentsData) {
            return undefined
        }
        commentsData.forEach(comment => {
            const article = document.createElement('article');
            const h3 = createElemWithText('h3', comment.name);
            const p1 = createElemWithText('p', comment.body);
            const p2 = createElemWithText('p', `From: ${comment.email}`);
            article.append(h3, p1, p2);
            fragment.appendChild(article);
        });
        return fragment;
    }
    
    //populateSelectMenu function
    function populateSelectMenu(usersData) {
        if(!usersData) {
            return undefined;
        }
        const selectMenu = document.getElementById('selectMenu');
        const options = createSelectOptions(usersData);
        options.forEach(option => selectMenu.appendChild(option));
        return selectMenu;
    }
    
    ///////////////////////////////////////////////////////
    
    //getUsers function
    async function getUsers() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    //getUserPosts function
    async function getUserPosts(userId) {
        if(!userId) {
            return undefined;
        }
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    //getUser function
    async function getUser(userId) {
        if (!userId) {
            return undefined;
        }
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    // 13. getPostComments function
    async function getPostComments(postId) {
        if(!postId) {
            return undefined;
        }
        try {
            const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    /////////////////////////////////////////
    
    //displayComments function
    async function displayComments(postId) {
        if(!postId) {
            return undefined;
        }
        const section = document.createElement('section');
        section.dataset.postId = postId;
        section.classList.add('comments', 'hide');
    
        const comments = await getPostComments(postId);
        const fragment = createComments(comments);
    
        section.appendChild(fragment);
    
        return section;
    }
    
    //createPosts function
    async function createPosts(postsData) {
        if(!postsData) {
            return undefined;
        }
        const fragment = document.createDocumentFragment();
    
        for (const post of postsData) {
            const article = document.createElement('article');
    
            const h2 = createElemWithText('h2', post.title);
            const p1 = createElemWithText('p', post.body);
            const p2 = createElemWithText('p', `Post ID: ${post.id}`);
    
            const author = await getUser(post.userId);
            const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
            const p4 = createElemWithText('p', author.company.catchPhrase);
    
            const button = document.createElement('button');
            button.textContent = 'Show Comments';
            button.dataset.postId = post.id;
    
            article.append(h2, p1, p2, p3, p4, button);
    
            const section = await displayComments(post.id);
            article.appendChild(section);
    
            fragment.appendChild(article);
        }
    
        return fragment;
    }
    
    // displayPosts function
    async function displayPosts(postsData) {
        const main = document.querySelector('main');
    
        let element;
        if (postsData) {
            element = await createPosts(postsData);
        } else {
            element = createElemWithText('p', 'Select an Employee to display their posts.');
            element.classList.add('default-text');
        }
    
        main.appendChild(element);
    
        return element;
    }
    
    ////////////////////////////////////////////////
    
    //refreshPosts function
    async function refreshPosts(postsData) {
        if(!postsData) {
            return undefined;
        }
        const removeButtons = removeButtonListeners();
        const main = deleteChildElements(document.querySelector('main'));
        const fragment = await displayPosts(postsData);
        const addButtons = addButtonListeners();
    
        const refreshPostsArray = [removeButtons, main, fragment, addButtons];
    
        return refreshPostsArray;
    }
    
    //function selectMenuChangeEventHandler
    async function selectMenuChangeEventHandler(event) {
        let selectMenu, userId, posts, refreshPostsArray;
    
        if (!event || !event.target) {
            userId = 1;
            posts = [];
            refreshPostsArray = [];
        } else {
            selectMenu = event.target;
            selectMenu.disabled = true;
    
            userId = selectMenu.value || 1;
            console.log('userId:', userId);
    
            posts = await getUserPosts(userId);
            posts = Array.isArray(posts) ? posts : [];
            console.log('posts:', posts);
    
            refreshPostsArray = await refreshPosts(posts);
            refreshPostsArray = Array.isArray(refreshPostsArray) ? refreshPostsArray : [];
            console.log('refreshPostsArray:', refreshPostsArray);
    
            selectMenu.disabled = false;
        }
    
        const result = [userId, posts, refreshPostsArray];
        console.log('result:', result);
        return result;
    }
    
    
    //initPage function
    async function initPage() {
        const users = await getUsers();
        const select = populateSelectMenu(users);
    
        return [users, select];
    }
    
    //initApp function
    function initApp() {
        initPage().then(() => {
            const selectMenu = document.querySelector('#selectMenu');
            selectMenu.addEventListener('change', async (event) => {
                const result = await selectMenuChangeEventHandler(event);
                if (result && result.length === 3) {
                    await refreshPosts(result[1]);
                }
            });
        });
    }
    
    
    document.addEventListener('DOMContentLoaded', initApp);
const fetchProfile = async () => {
    const username = document.getElementById('usernameInput').value;
    const profileDiv = document.getElementById('profile');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (username) {
        loadingSpinner.style.display = 'block';
        profileDiv.style.display = 'none';

        if (username.trim() !== "") {
            //hide spinner by removing the d-none class and hide profile div
            loadingSpinner.classList.remove('d-none');
            profileDiv.style.display = 'none';

            try {
                // Fetch user data from GitHub API by using ajax call with fetch and await the response
                const response = await fetch(`https://api.github.com/users/${username}`);
                const data = await response.json();

                loadingSpinner.classList.add('d-none');  //show spinner by adding the d-none class

                if (data.message === "Not Found") {
                    // If user is not found, display an error message
                    profileDiv.innerHTML = "<p class='error'>User not found. Please try again.</p>";
                    profileDiv.style.display = "block";
                } else {
                    // If user is found, display the profile information
                    profileDiv.innerHTML = `
                <img src="${data.avatar_url}" alt="${data.login}">
                <h2>${data.name || data.login}</h2>
                <p>${data.bio || 'No bio available'}</p>
                <span><strong>Location:</strong> ${data.location || 'Not specified'}</span><br>
                <span><strong>Company:</strong> ${data.company || 'Not specified'}</span><br>
                <span><strong>Twitter:</strong> ${data.twitter_username ? '@' + data.twitter_username : 'Not available'}</span><br>
                <span><strong>Member since:</strong> ${new Date(data.created_at).toLocaleDateString()}</span>
                <div class="profile-stats">
                <div class="stat">
                    <p>Repos: ${data.public_repos}</p>
                </div>
                <div class="stat">
                    <p>Followers: ${data.followers}</p>
                </div>
                <div class="stat">
                    <p>Following: ${data.following}</p>
                </div>
                </div>
                <a href="${data.html_url}" target="_blank">Visit GitHub Profile</a>
                `;
                    profileDiv.style.display = "block";
                }
            } catch (error) {
                // If there's an error during the fetch, display a generic error message
                loadingSpinner.style.display = 'none';
                profileDiv.innerHTML = "<p class='error'>An error occurred. Please try again later.</p>";
                profileDiv.style.display = "block";
            }
        }
    }
}

document.getElementById('button-addon2').addEventListener('click', fetchProfile);

document.getElementById('usernameInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        fetchProfile();
    }
});



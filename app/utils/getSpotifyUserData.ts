export const getSpotifyUserData = async (accessToken: string) => {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    const data = await response.json();
    return data.id;
  };
  
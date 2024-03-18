const storyDataAccess = require("../../Data-Access-Layer/stories/story-dal")
const usersDataAccess = require("../../Data-Access-Layer/users/user-dal")
const episodeDataAccess = require("../../Data-Access-Layer/episodes/episode-dal")

//addStory : this function is to create a story for logged-in user.
exports.addStory = async (req, res) => {
    try {
        const userData = await usersDataAccess.findUserById(req.token_data._id)
        const data = {
            authorId: userData?._id,
            routineType: req.body.routineType,
            coverTitle: req.body.coverTitle,
            genre: req.body.genre,
            lineStyle: req.body.lineStyle,
            dateOfPublication: req.body.dateOfPublication,
            authorName: userData?.penName

        };

        const storedStory = await storyDataAccess.storeStory(data);
        if (storedStory) {
            let Email = userData?.email
            const userToUpdate = {
                Email,
                toUpdate: {
                    authorId: storedStory?.authorId
                },
            };

            await usersDataAccess.updateUser(userToUpdate)

            res.json({
                message: "Story has been stored successfully",
                data: storedStory,
                status: res.statusCode
            })

        }

    } catch (err) {
        res.json({
            message: "Something went wrong",
            error: err.message,
            status: res.statusCode
        })

    }
};

//getStory: this function is to get the story with the authorId.
exports.getStory = async (req, res) => {
    try {
        const authorId = req.params.authorId;
        let stories = await storyDataAccess.findStoryById(authorId);

        if (stories.length > 0) {
            descendingOrderStories = stories.reverse();

            // Fetch episodes for each story and include backgroundImage
            const storiesWithEpisodes = await Promise.all(
                descendingOrderStories.map(async (story) => {
                    const episodes = await episodeDataAccess.getEpisodeById(story._id);
                    const authorData = await usersDataAccess.findUserById(story.authorId);

                    return {
                        ...story.toObject(),
                        backgroundImage: authorData?.backgroundImage,
                        episodes,
                        description: authorData?.description,
                        authorDetails: authorData
                    };
                })
            );

            res.status(200).json({
                message: "Stories Found",
                data: storiesWithEpisodes,
            });
        } else {
            res.status(404).json({
                message: "No Stories Available",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            status: 500,
        });
    }
};

//getStoryByStoryId : this function is to fetch the story based on storyId

exports.getStoryByStoryId = async (req, res) => {
    try {
        const StoryId = req.params.storyId;
        const story = await storyDataAccess.findStoryByStoryId(StoryId);

        if (story) {
            const episodes = await episodeDataAccess.getEpisodeById(story._id);
            const authorData = await usersDataAccess.findUserById(story.authorId);

            const storyWithEpisodes = {
                ...story.toObject(),
                backgroundImage: authorData?.backgroundImage,
                episodes,
                email: authorData?.email,
                description: authorData?.description
            };

            res.status(200).json({
                message: "Story Found",
                data: storyWithEpisodes,
            });
        } else {
            res.status(404).json({
                message: "No Story Available",
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            status: 500,
        });
    }
};


//updateStory: this function is to update a story based on storyId that is given in parameter.
exports.updateStory = async (req, res) => {
    try {
        let StoryId = req.params.storyId
        let fieldsToUpdate = req.body
        // Validate fieldsToUpdate
        if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                message: "Fields to update are missing or empty",
                status: 400
            });
        }

        const UpdateStory = {
            StoryId,
            toUpdate: {
                routineType: fieldsToUpdate.routineType,
                coverTitle: fieldsToUpdate.coverTitle,
                genre: fieldsToUpdate.genre,
                lineStyle: fieldsToUpdate.lineStyle,
                dateOfPublication: fieldsToUpdate.dateOfPublication,
                authorName: fieldsToUpdate.authorName,
                isPublished: fieldsToUpdate.isPublished
            },
        };

        const update = await storyDataAccess.updateStory(UpdateStory);

        if (update.isPublished === false) {
            const foundEpisode = await episodeDataAccess.getEpisodeById(StoryId);
            if (foundEpisode && foundEpisode.length > 0) {

                const storiesWithEpisodes = await Promise.all(
                    foundEpisode.map(async (data) => {
                        let id = data._id
                        const UpdateEpi = {
                            id,
                            toUpdate: {
                                isPublished: false
                            },
                        };

                        await episodeDataAccess.updateEpisodeById(UpdateEpi);

                    })
                );

            } else {
                res.status(404).json({
                    message: "No Matching Stories Found",
                });
            }
        }
        else {
            const foundEpisode2 = await episodeDataAccess.getEpisodeById(StoryId);
            if (foundEpisode2 && foundEpisode2.length > 0) {

                const storiesWithEpisodes2 = await Promise.all(
                    foundEpisode2.map(async (data) => {
                        let id = data._id
                        const UpdateEpi2 = {
                            id,
                            toUpdate: {
                                isPublished: true
                            },
                        };

                        const UpdateEpi3 = {
                            id,
                            toUpdate: {
                                isPublished: false
                            },
                        };


                        if (await data.characterLimitStatus) {

                            await episodeDataAccess.updateEpisodeById(UpdateEpi2);
                        }
                        else {
                            await episodeDataAccess.updateEpisodeById(UpdateEpi3);
                        }

                    })
                );

            } else {
                res.status(404).json({
                    message: "No Matching Stories Found",
                });
            }

        }
        if (update) {

            res.status(200).json({
                message: "Story Updated",
                data: update
            });
        }
        else {
            res.status(404).json({
                message: "Story Can't be Updated because its not available"
            });
        }

    } catch (error) {
        console.error("Error updating story:", error);
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}

//deleteStory: this function is to delete the story based on storyId that is given in the body.
exports.deleteStory = async (req, res) => {
    try {
        let id = req.body.storyId
        const DeleteStory = await storyDataAccess.deleteStory(id);
        if (DeleteStory) {
            await episodeDataAccess.deleteEpisodeByStoryId(id);
            res.status(200).json({
                message: "Story deleted",
                data: DeleteStory
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}

//add episode: this function is to create an episode for logged-in user.
exports.addEpisode = async (req, res) => {
    try {
        const data = {
            authorId: req.token_data._id,
            storyId: req.body.storyId,
            episodeTitle: req.body.episodeTitle,
            description: req.body.description,
            routineType: req.body.routineType,
            genre: req.body.genre,
            coverTitle: req.body.coverTitle
        }

        storedData = await episodeDataAccess.saveEpisode(data)
        if (storedData) {
            res.status(200).json({
                message: "Episode Saved",
                data: storedData
            });

        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}



// getEpisode: this function is for fetching the episode by storyId
exports.getEpisode = async (req, res) => {
    try {
        const StoryId = req.params.storyId;
        const foundEpisodes = await episodeDataAccess.getEpisodeById(StoryId);

        if (foundEpisodes && foundEpisodes.length > 0) {
            const allEpisodesPublished = foundEpisodes.every(episode => episode.isPublished);

            if (allEpisodesPublished===false) {
                const story = await storyDataAccess.findStoryByStoryId(StoryId);
                if (story) {
                    const UpdateStory = {
                        StoryId,
                        toUpdate: {
                            isPublished: false
                        },
                    };
                    await storyDataAccess.updateStory(UpdateStory);
                }
                else {
                    const UpdateStory2 = {
                        StoryId,
                        toUpdate: {
                            isPublished: true
                        },
                    };
                    await storyDataAccess.updateStory(UpdateStory2);
                }
                
            }

            res.status(200).json({
                message: "Episodes Found",
                data: foundEpisodes
            });
        } else {
            res.status(404).json({
                message: "No Episode Found",
                status: 404
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });

    }
}


//getEpisdodeByIdAndAuthor: this function is to get the episode with episodeId and story
exports.getEpisodeByIdAndStory = async (req, res) => {
    try {
        const StoryId = req.params.storyId
        const id = req.params.episodeId
        const foundEpisode = await episodeDataAccess.getEpisodeByIdAndStory(StoryId, id)
        if (foundEpisode && foundEpisode.length > 0) {

            descendingOrderStories = foundEpisode.reverse();
            const Episodes = await Promise.all(
                descendingOrderStories.map(async (episode) => {
                    const authorData = await usersDataAccess.findUserById(episode.authorId);
                    return {
                        ...episode.toObject(),
                        authorDetails: authorData
                    };
                })
            )
            res.status(200).json({
                message: "Episode Found",
                data: Episodes,
            });
        } else {
            res.status(404).json({
                message: "No Episode Found",
                status: 404
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });

    }
}

//deleteEpisode: this function is to delete the episode based on episodeId i.e, _id in (episode's collection) .
exports.deleteEpisode = async (req, res) => {
    try {
        let id = req.body.episodeId
        const DeleteEpisode = await episodeDataAccess.deleteEpisode(id);
        res.status(200).json({
            message: "Episode deleted",
            data: DeleteEpisode
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }

}

//updateEpisode: this function is to update an episode based on episodeId i.e _id in episodes collection that is given in the parameter.
exports.updateEpisode = async (req, res) => {
    try {
        let id = req.params.episodeId
        let fieldsToUpdate = req.body

        // Validate fieldsToUpdate
        if (!fieldsToUpdate || Object.keys(fieldsToUpdate).length === 0) {
            return res.status(400).json({
                message: "Fields to update are missing or empty",
                status: 400
            });
        }

        const UpdateEpisode = {
            id,
            toUpdate: {
                episodeTitle: fieldsToUpdate.episodeTitle,
                description: fieldsToUpdate.description,
                isPublished: fieldsToUpdate.isPublished,
                characterLimitStatus: fieldsToUpdate.characterLimitStatus
            },
        };

        const update = await episodeDataAccess.updateEpisodeById(UpdateEpisode);

        if (update.isPublished === true) {
            let StoryId = update?.storyId
            const UpdateStory = {
                StoryId,
                toUpdate: {
                    isPublished: true
                },
            };

            await storyDataAccess.updateStory(UpdateStory);
     
        }
        res.status(200).json({
            message: "Episode Updated",
            data: update
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}

//fetch story with episodes

exports.fetchStories = async (req, res) => {
    try {
        const { authorId, genre, routineType, coverTitle, dateOfPublication, penName } = req.query;
        const filter = {};
        if (authorId) filter.authorId = authorId;
        if (genre) filter.genre = genre;
        if (routineType) filter.routineType = routineType;
        if (coverTitle) filter.coverTitle = coverTitle;
        if (dateOfPublication) filter.dateOfPublication = dateOfPublication;
        // Find user by penName
        if (penName) {
            const userData = await usersDataAccess.findUserByPenName(penName);
            if (userData) {
                filter.authorId = userData._id;
            } else {
                return res.status(404).json({
                    message: "No Matching User Found",
                });
            }
        }

        // Find stories that match the filter
        const filteredStories = await storyDataAccess.findStoriesByFilter(filter);

        if (filteredStories && filteredStories.length > 0) {
            // Fetch episodes for each filtered story and include background image
            const storiesWithEpisodes = await Promise.all(
                filteredStories.map(async (story) => {
                    const episodes = await episodeDataAccess.getEpisodeById(story._id);
                    const authorData = await usersDataAccess.findUserById(story.authorId);

                    return {
                        ...story.toObject(),
                        backgroundImage: authorData?.backgroundImage,
                        episodes,
                        authorDetails: authorData
                    };
                })
            );

            res.status(200).json({
                message: "Filtered Stories Found",
                data: storiesWithEpisodes,
            });
        } else {
            res.status(404).json({
                message: "No Matching Stories Found",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500,
        });
    }
};


//getEpiodeByAuthor: this function is to fetch the episode based on the logged-in user
exports.getEpisodeByAuthor = async (req, res) => {
    try {
        const AuthorId = req.params.authorId;
        const foundEpisode = await episodeDataAccess.getEpisodeByAuthorId(AuthorId);
        const descendingOrderEpisodes = foundEpisode.reverse();
        if (foundEpisode && foundEpisode.length > 0) {
            res.status(200).json({
                message: "Episodes Found",
                data: descendingOrderEpisodes
            });
        } else {
            res.status(404).json({
                message: "No Episodes Found",
                status: 404
            });
        }

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500
        });
    }
}

exports.searchStories = async (req, res) => {
    try {
        const key = req.params.key || "";
        let result = await storyDataAccess.searchStory(key);

        if (result && result.length > 0) {
            // Fetch episodes and backgroundImage for each story in the result
            const storiesWithEpisodes = await Promise.all(
                result.map(async (story) => {
                    const episodes = await episodeDataAccess.getEpisodeById(story._id);
                    const authorData = await usersDataAccess.findUserById(story.authorId);

                    return {
                        ...story.toObject(),
                        backgroundImage: authorData?.backgroundImage,
                        description: authorData?.description,
                        episodes
                    };
                })
            );

            res.status(200).json({
                message: "Data found",
                data: storiesWithEpisodes,
            });
        } else {
            res.status(404).json({
                message: "No Matching Stories Found",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500,
        });
    }
};

//findRecentAuthorStories: this function is to fetch the recent authors stories
exports.findRecentAuthorStories = async (req, res) => {
    try {
        const authors = await usersDataAccess.findUser();
        const recentAuthors = authors.reverse();

        const storiesWithEpisodes = await Promise.all(
            recentAuthors.map(async (author) => {
                const authorId = author._id;
                const stories = await storyDataAccess.findStoryById(authorId);

                const storiesWithEpisodes = await Promise.all(
                    stories.map(async (story) => {
                        const episodes = await episodeDataAccess.getEpisodeById(story._id);
                        const authorData = await usersDataAccess.findUserById(story.authorId);

                        return {
                            ...story.toObject(),
                            backgroundImage: authorData?.backgroundImage,
                            description: authorData?.description,
                            episodes
                        };
                    })
                );

                return {
                    authorId,
                    stories: storiesWithEpisodes
                };
            })
        );

        res.status(200).json({
            message: "Recent Authors and Their Stories Found",
            data: storiesWithEpisodes,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            status: 500,
        });
    }
};

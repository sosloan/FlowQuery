unwind [
    {
        situation_recap: "Once upon a time, there was a conversation. It was a good conversation. There were many objectives in the conversation.",
        objectives: ["Objective 1", "Objective 2"],
        feedbacks: [
            {
                feedbackType: "compliment",
                reasoning: "You conversed well",
                title: "Good job"
            },
            {
                feedbackType: "suggestion",
                reasoning: "Don't forget to remember",
                title: "Don't forget"
            }
        ],
        contacts: [
            {email: "bob@mail.com", displayName: "Bob"},
            {email: "jane@mail.com", displayName: "Jane"}
        ],
        dimension: "Coaching",
        supporting_messages: [
            {
                text: "This is a supporting message",
                sender: {
                    email: "bob@mail.com",
                    displayName: "Bob"
                }
            },
            {
                text: "This is another supporting message",
                sender: {
                    email: "jane@mail.com",
                    displayName: "Jane"
                }
            }
        ]
    },
    {
        situation_recap: "The conversation was about a topic. The objectives were clear. The feedbacks were insightful.",
        objectives: ["Objective 3", "Objective 4"],
        feedbacks: [
            {
                feedbackType: "compliment",
                reasoning: "Very funny conversation",
                title: "Good job"
            },
            {
                feedbackType: "suggestion",
                reasoning: "Remember to not forget",
                title: "Remember"
            }
        ],
        contacts: [
            {email: "robot@mail.com", displayName: "Robot"},
            {email: "r2d2@mail.com", displayName: "R2D2"}
        ],
        dimension: "Coaching",
        supporting_messages: [
            {
                text: "This is a robot supporting message",
                sender: {
                    email: "robot@mail.com",
                    displayName: "Robot"
                }
            },
            {
                text: "This is a R2D2 supporting message",
                sender: {
                    email: "r2d2@mail.com",
                    displayName: "R2D2"
                }
            }
        ]
    }
] as coach_note
return
    coach_note.situation_recap as situation_recap,
    coach_note.objectives as objectives,
    coach_note.feedbacks as feedbacks,
    coach_note.contacts as contacts,
    coach_note.dimension as dimension,
    'AGGREGATE_COACH_NOTE' as type,
    coach_note.supporting_messages as supporting_messages
import { apiFetch } from "../fetch";

export async function getEvents(){
    const data = await apiFetch("/events", {
        cache: "no-store"
    })

    return data.data
}

export async function getEventById(id: string) {
    try {
        const events = await getEvents();
        const event = events.find((item: any) => item.id === id || item.ID === id);

        if (event) {
            return event;
        }

        const data = await apiFetch(`/events/${id}`, {
            cache: "no-store",
        });

        return data.data;
    } catch (error) {
        const events = await getEvents();
        const event = events.find((item: any) => item.id === id || item.ID === id);

        if (!event) {
            throw error;
        }

        return event;
    }
}

export async function createEvent(body: any) {
    return apiFetch("/events", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function updateEvent(id: string, body: any) {
    return apiFetch(`/events/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deleteEvent(id: string) {
    return apiFetch(`/events/${id}`, {
        method: "DELETE",
    });
}

import { apiFetch } from "../fetch";

export async function getPackages() {
    const data = await apiFetch("/packages", {
        cache: "no-store",
    });

    return data.data;
}

export async function getPackageById(id: string) {
    try {
        const packages = await getPackages();
        const pkg = packages.find((item: any) => item.ID === id);

        if (pkg) {
            return pkg;
        }

        const data = await apiFetch(`/packages/${id}`, {
            cache: "no-store",
        });

        return data.data;
    } catch (error) {
        const packages = await getPackages();
        const pkg = packages.find((item: any) => item.ID === id);

        if (!pkg) {
            throw error;
        }

        return pkg;
    }
}

export async function getPackageBySlug(slug: string) {
    const data = await apiFetch(`/packages/slug/${slug}`, {
        cache: "no-store",
    });

    return data.data;
}

export async function createPackage(body: any) {
    return apiFetch("/packages", {
        method: "POST",
        body: JSON.stringify(body),
    });
}

export async function updatePackage(id: string, body: any) {
    return apiFetch(`/packages/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
    });
}

export async function deletePackage(id: string) {
    return apiFetch(`/packages/${id}`, {
        method: "DELETE",
    });
}

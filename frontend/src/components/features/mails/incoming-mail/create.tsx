"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { createIncomingMail } from "@/lib/api/mails/incoming"

export default function IncomingCreate({ categories }: { categories: any[] }) {
        const router = useRouter()
        const [loading, setLoading] = useState(false)
        const [files, setFiles] = useState<File[]>([])

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault()
                setLoading(true)

                const formData = new FormData(e.currentTarget)

                if (files.length > 0) {
                        formData.append("attachment", files[0])
                }

                const res = await createIncomingMail(formData)

                if (res.ok) {
                        alert("Berhasil menambahkan surat masuk")
                        router.push("/workspace/mail/incoming")
                } else {
                        alert("Gagal menambahkan surat masuk.")
                }

                setLoading(false)
        }

        return (
                <form
                        onSubmit={handleSubmit}
                        className="bg-white p-8 rounded-lg shadow space-y-8"
                >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 gap-y-8">
                                <div className="col-span-2">
                                        <Input
                                                label="Mail Number"
                                                id="number"
                                                name="number"
                                                type="text"
                                                placeholder="Example: IM-001/RT/2025"
                                        />
                                </div>

                                <div>
                                        <Select
                                                label="Mail Category"
                                                id="category_id"
                                                name="category_id"
                                                defaultValue=""
                                                placeholder="Select Category"
                                                options={categories.map((cat) => ({
                                                        value: cat.id,
                                                        label: cat.name,
                                                }))}
                                        />
                                </div>

                                <div>
                                        <Input label="Mail Date" id="date" name="date" type="date" />
                                </div>

                                <div className="col-span-2">
                                        <label
                                                htmlFor="description"
                                                className="text-sm font-medium text-gray-700"
                                        >
                                                Description
                                        </label>
                                        <textarea
                                                id="desc"
                                                name="desc"
                                                rows={4}
                                                placeholder="Write mail description..."
                                                className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-sm"
                                        />
                                </div>

                                <div className="col-span-2">
                                        <FileDropzone
                                                label="Attachment (File)"
                                                name="attachment"
                                                onFilesAccepted={(accepted) => setFiles(accepted)} 
                                        />
                                </div>

                                <div className="col-span-2">
                                        <Button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:brightness-90 transition"
                                        >
                                                {loading ? "Submitting..." : "Submit"}
                                        </Button>
                                </div>
                        </div>
                </form>
        )
}

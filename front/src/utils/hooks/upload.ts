import { useDropzone } from "react-dropzone";

export const useS3Upload = ({
	signingEndpoint,
	onUploadStart,
	onUploadReady,
	onError,
}) => {
	const handleDrop = async ([pendingImage]) => {
		const extension = pendingImage.name.match(/.*\.(.*)/)[1];
		const filename = `${crypto.randomUUID()}.${extension}`;
		const presignedUploadUrl =
			await (await fetch(`${signingEndpoint}?objectPath=${filename}`)).json();
		// Let the caller know that a file has been selected and a fetch is beginning.
		onUploadStart();

		// Upload the image to our pre-signed URL.
		const response = await fetch(
			new Request(presignedUploadUrl, {
				method: "PUT",
				body: pendingImage,
				headers: new Headers({
					"Content-Type": "image/*",
				}),
			}),
		);
		if (response.status !== 200) {
			// The upload failed, so let's notify the caller.
			onError();
			return;
		}
		// Let the caller know that the upload is done, so that it can send the URL
		// to the backend again, persisting it to the database.
		const uploadedURL = new URL(presignedUploadUrl);
		onUploadReady(`${uploadedURL.origin}/${uploadedURL.pathname}`);
	};

	return useDropzone({
		accept: { "image/*": [] },
		onDrop: handleDrop,
	});
};

import { PineconeClient } from '@pinecone-database/pinecone';
import { convertToAscii } from './utils';
import { getEmbeddings } from './embeddings';

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  // Create a Pinecone client instance
  const pinecone = new PineconeClient();
  // Initialize the client with your API key and environment
  await pinecone.init({
    apiKey: process.env.PINECONE_API_KEY!,
    environment: process.env.PINECONE_ENVIRONMENT!,
  });
  // Connect to the chatpdf index in Pinecone
  const index = await pinecone.Index('chatpdf');

  try {
    // Convert the fileKey to ASCII for namespace
    const namespace = convertToAscii(fileKey);
    // Query the index with the provided embeddings
    const queryResult = await index.query({
      queryRequest: {
        topK: 5, // Return the top 5 matches
        vector: embeddings,
        includeMetadata: true, // Include metadata in the response
        namespace, // Use the fileKey as the namespace
      },
    });
    // Return the matching documents or an empty array
    return queryResult.matches || [];
  } catch (error) {
    // Log and throw any errors
    console.log('error querying embeddings', error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  // Obtain the embeddings for the query
  const queryEmbeddings = await getEmbeddings(query);
  // Get matches from the embeddings for the provided query and fileKey
  const matches = await getMatchesFromEmbeddings(queryEmbeddings, fileKey);
  // Filter qualifying documents based on match scores
  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );
  // Extract text from qualifying documents and concatenate them, limiting to 3000 characters
  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // Limit the concatenated text to 3000 characters
  return docs.join('\n').substring(0, 3000);
}

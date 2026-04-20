import { failure } from "../shared";
import { urlParser, urlSerializer } from "../url";

export function encodingParseURL(
  url: string,
  document: Document,
): URL | typeof failure {
  const encoding = document.characterSet;
  const baseURL = new URL(document.baseURI);

  return urlParser(url, baseURL, encoding);
}

export function encodingParseAndSerializeURL(
  url: string,
  document: Document,
): string | typeof failure {
  const urlRecord = encodingParseURL(url, document);

  if (urlRecord === failure) {
    return failure;
  }

  return urlSerializer(urlRecord);
}

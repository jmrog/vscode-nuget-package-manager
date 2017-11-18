const xmlDeclarationStart = '<?xml ';

// NOTE: This method obviously does not check if the file actually is validly formatted XML. That
// much is assumed. What's not assumed is that the first line is an XML declaration, which is what
// this checks for. Good enough to close #29.
export default function isHeadlessXML(candidateXML = '') {
    return candidateXML.slice(0, 6).toLowerCase() !== xmlDeclarationStart;
}

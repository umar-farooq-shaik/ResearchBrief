const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.js') || file.endsWith('.jsx')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const files = getAllFiles('./src/components/ui');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;

    // Fix React.forwardRef>(
    content = content.replace(/React\.forwardRef>\(/g, 'React.forwardRef(');

    // Fix React.forwardRef<
    // If we have "React.forwardRef<(" (maybe?)
    content = content.replace(/React\.forwardRef<\(/g, 'React.forwardRef(');

    // Custom fixes for Header/Footer/etc damage
    // Pattern: ({ className, ...props }={cn(
    // Expectation: ({ className, ...props }) => (<div className={cn(

    // We need to be careful about matching.
    // The damage seems to be: ": Type) => (<div className" -> "="
    // or "}: Type) => (<div className" -> "}="

    // Let's look for "}={cn"
    if (content.includes('}={cn')) {
        // Check if it is Header, Footer -> div
        // Title -> h? 
        // Description -> p?

        // We can try to guess based on component name?
        // Or just replace with `}) => (<div className={cn` for all, then manually fix Title/Description if they are not divs?
        // Shadcn AlertTitle is h5. AlertDescription is div.
        // CardTitle is h3. 
        // DialogTitle is h2?

        // Replacing with `div` is a safe functional start, but semantic HTML might suffer.
        // Better than broken build.

        content = content.replace(/}=\s*{cn/g, '}) => (<div className={cn');
    }

    // Also check for mismatch of `/>` at end if we restored `div` start.
    // The valid code was `... {...props} />`. The invalid code still has `... {...props} />`.
    // So we just need to ensure opening tag matches.

    // Fix specific known element types if possible
    // AlertTitle -> h5
    if (file.includes('alert.jsx')) {
        // AlertTitle might be damaged? 
        // content = content.replace(...)
    }

    fs.writeFileSync(file, content);
});

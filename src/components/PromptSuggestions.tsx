interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
  isDraftMode: boolean;
}

const draftPrompts = [
  { icon: '✏️', text: 'Corrige les fautes', prompt: 'Corrige les fautes d\'orthographe et de grammaire' },
  { icon: '🎨', text: 'Améliore le style', prompt: 'Améliore le style et rends le texte plus professionnel' },
  { icon: '🌍', text: 'Traduis en anglais', prompt: 'Traduis ce texte en anglais' },
  { icon: '📝', text: 'Résume', prompt: 'Résume ce texte en conservant les points essentiels' },
  { icon: '📋', text: 'Liste à puces', prompt: 'Transforme ce texte en liste à puces structurée' },
  { icon: '✨', text: 'Plus créatif', prompt: 'Rends ce texte plus créatif et engageant' },
];

const chatPrompts = [
  { icon: '💡', text: 'Explique-moi', prompt: 'Peux-tu m\'expliquer' },
  { icon: '📚', text: 'Donne des exemples', prompt: 'Peux-tu me donner des exemples de' },
  { icon: '🔍', text: 'Analyse', prompt: 'Peux-tu analyser' },
  { icon: '💭', text: 'Conseils', prompt: 'Quels conseils peux-tu me donner sur' },
];

export function PromptSuggestions({ onSelectPrompt, isDraftMode }: PromptSuggestionsProps) {
  const prompts = isDraftMode ? draftPrompts : chatPrompts;

  return (
    <div className="mb-4">
      <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2">
        <span>⚡</span>
        <span>{isDraftMode ? 'Suggestions pour modifier le document :' : 'Suggestions rapides :'}</span>
      </h3>
      <div className="flex flex-wrap gap-2">
        {prompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt.prompt)}
            className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-indigo-50:bg-indigo-900/30 border border-gray-200 hover:border-indigo-300:border-indigo-600 rounded-lg text-xs text-gray-700 hover:text-indigo-700:text-indigo-400 transition-all hover:scale-105 hover:shadow-md"
            title={prompt.prompt}
          >
            <span className="text-base group-hover:scale-110 transition-transform">{prompt.icon}</span>
            <span className="font-medium">{prompt.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

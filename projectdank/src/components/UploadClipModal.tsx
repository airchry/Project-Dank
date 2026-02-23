import { useState } from 'react';
import { X, Upload, Video, Image as ImageIcon, Check } from 'lucide-react';

type UploadClipModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

export type ClipData = {
  title: string;
  game: string;
  description: string;
  type: 'video' | 'image';
  tags: string[];
  file?: File;
}

const availableGames = [
  'Lethal Company',
  'The Backrooms',
  'Zort',
  'Phasmophobia',
  'Content Warning',
  'Devour',
  'Other',
];

const suggestedTags = [
  'fail', 'scream', 'clutch', 'panic', 'chaos', 'funny', 
  'epic', 'meme', 'wtf', 'noob', 'pro', 'viral'
];

function UploadClipModal({ isOpen, onClose, onSubmit }: UploadClipModalProps) {
  const [formData, setFormData] = useState<ClipData>({
    title: '',
    game: 'Lethal Company',
    description: '',
    type: 'video',
    tags: [],
  });

  const [customTag, setCustomTag] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [file, setFile] = useState<File | null>(null);


  if (!isOpen) return null;   

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!file) return;

    const data = new FormData();
    data.append("title", formData.title);
    data.append("game", formData.game);
    data.append("description", formData.description);
    data.append("type", formData.type);
    data.append("tags", JSON.stringify(formData.tags));
    data.append("video", file);

    await onSubmit(data);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        title: '',
        game: 'Lethal Company',
        description: '',
        type: 'video',
        tags: [],
      });
      setFile(null);
      onClose();
    }, 1500);
  };

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const addCustomTag = () => {
    if (customTag && !formData.tags.includes(customTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, customTag]
      }));
      setCustomTag('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-black-900 border-4 border-pink-900/70 rounded-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-pink-950 border-b-4 border-pink-900/70 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-left text-2xl text-orange-400">
              Upload Clip
            </h2>
            <p className="text-sm text-gray-400 mt-1 font-normal">Share your epic gaming moments!</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-orange-400 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {submitted ? (
          // Success State
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 border-4 border-green-500 rounded-full mb-4 animate-pulse">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl text-green-400 mb-2">SUCCESS!</h3>
            <p className="text-gray-400">Clip berhasil di-upload ke Vault!</p>
          </div>
        ) : (
          // Form
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm text-orange-400 mb-3 text-xs">
                Clip Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'video' }))}
                  className={`flex items-center justify-center gap-2 p-4 border-3 rounded transition-all ${
                    formData.type === 'video'
                      ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                      : 'border-pink-900/30 bg-pink-950/10 text-gray-400 hover:border-orange-500/50'
                  }`}
                >
                  <Video className="w-5 h-5" />
                  <span>Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, type: 'image' }))}
                  className={`flex items-center justify-center gap-2 p-4 border-3 rounded transition-all ${
                    formData.type === 'image'
                      ? 'border-orange-500 bg-orange-500/20 text-orange-400'
                      : 'border-pink-900/30 bg-pink-950/10 text-gray-400 hover:border-orange-500/50'
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  <span>Image</span>
                </button>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm text-orange-400 mb-2 text-xs">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Epic Last Second Clutch"
                className="w-full bg-black/50 border-3 border-pink-900/30 rounded-lg p-3 text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Game Selection */}
            <div>
              <label className="block text-sm text-orange-400 mb-2 text-xs">
                Game *
              </label>
              <select
                value={formData.game}
                onChange={(e) => setFormData(prev => ({ ...prev, game: e.target.value }))}
                className="w-full bg-black/50 border-3 border-pink-900/30 rounded-lg p-3 text-gray-300 focus:border-orange-500/50 focus:outline-none transition-colors"
                required
              >
                {availableGames.map(game => (
                  <option key={game} value={game} className="bg-black">
                    {game}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-orange-400 mb-2 text-xs">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your epic moment..."
                className="w-full bg-black/50 border-3 border-pink-900/30 rounded-lg p-3 text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none resize-none transition-colors"
                rows={4}
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm text-orange-400 mb-2 text-xs">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {suggestedTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded text-sm border-2 transition-all ${
                      formData.tags.includes(tag)
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500'
                        : 'bg-pink-950/10 text-gray-400 border-pink-900/30 hover:border-orange-500/50'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
              
              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomTag())}
                  placeholder="Add custom tag..."
                  className="flex-1 bg-black/50 border-3 border-pink-900/30 rounded-lg p-2 text-sm text-gray-300 placeholder-gray-600 focus:border-orange-500/50 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="px-4 py-2 bg-pink-500/20 border-2 border-pink-500/30 text-pink-400 rounded-lg hover:bg-pink-500/30 transition-all text-sm"
                >
                  Add
                </button>
              </div>

              {/* Selected Tags */}
              {formData.tags.length > 0 && (
                <div className="mt-3 p-3 bg-orange-500/5 border-2 border-orange-900/30 rounded-lg">
                  <div className="text-xs text-orange-400/70 mb-2">Selected:</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 bg-orange-500/20 text-orange-400 px-2 py-1 rounded text-xs border border-orange-500/30"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="hover:text-orange-300"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* File Upload Note */}
            <div className="border-2 border-dashed border-pink-900/30 rounded-lg p-6 text-center bg-pink-950/5">
              <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
               <input
                type="file"
                accept={formData.type === 'video' ? 'video/*' : 'image/*'}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="clip-upload"
              />
              <label
                htmlFor="clip-upload"
                className="cursor-pointer text-sm text-orange-400 hover:text-orange-300"
              >
                {file ? file.name : 'Click to select file'}
              </label>
              <p className="text-xs text-gray-600 mt-2">
                {formData.type === 'video' ? 'MP4 / WebM recommended' : 'PNG / JPG recommended'}
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-3 border-pink-900/30 text-gray-400 rounded-lg hover:border-pink-500/50 hover:text-pink-400 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 arcade-btn bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 py-3 rounded-lg"
              >
                Upload Clip!
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default UploadClipModal;
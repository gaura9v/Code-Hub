import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosClient from '../utils/axiosClient';
import { useNavigate } from 'react-router';

const problemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  tags: z.enum(['array', 'linkedList', 'graph', 'dp']),
  isBugInjection: z.boolean().optional(),
  visibleTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
      explanation: z.string().min(1, 'Explanation is required'),
    })
  ).min(1, 'At least one visible test case required'),
  hiddenTestCases: z.array(
    z.object({
      input: z.string().min(1, 'Input is required'),
      output: z.string().min(1, 'Output is required'),
    })
  ).min(1, 'At least one hidden test case required'),
  startCode: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      initialCode: z.string().min(1, 'Initial code is required'),
    })
  ).length(3, 'All three languages required'),
  referenceSolution: z.array(
    z.object({
      language: z.enum(['C++', 'Java', 'JavaScript']),
      completeCode: z.string().min(1, 'Complete code is required'),
    })
  ).length(3, 'All three languages required'),
});

function AdminPanel() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      isBugInjection: false,
      startCode: [
        { language: 'C++', initialCode: '' },
        { language: 'Java', initialCode: '' },
        { language: 'JavaScript', initialCode: '' },
      ],
      referenceSolution: [
        { language: 'C++', completeCode: '' },
        { language: 'Java', completeCode: '' },
        { language: 'JavaScript', completeCode: '' },
      ],
    },
  });

  const { fields: visibleFields, append: appendVisible, remove: removeVisible } = useFieldArray({
    control,
    name: 'visibleTestCases',
  });

  const { fields: hiddenFields, append: appendHidden, remove: removeHidden } = useFieldArray({
    control,
    name: 'hiddenTestCases',
  });

  const onSubmit = async (data) => {
    try {
      await axiosClient.post('/problem/create', data);
      alert('Problem created successfully!');
      console.log(data)
      navigate('/');
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-base-100 shadow-2xl rounded-2xl p-8 space-y-8">
        <h1 className="text-3xl font-bold text-center">Create New Problem</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

          {/* Basic Info */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Basic Information</h2>

            <div className="form-control">
              <label className="label">Title</label><br /><br />
              <input
                {...register('title')}
                placeholder="Enter title"
                className={`input input-bordered w-full rounded-xl ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && <p className="text-error mt-1">{errors.title.message}</p>}
            </div>

            <div className="form-control">
              <label className="label">Description</label> <br /><br />
              <textarea
                {...register('description')}
                placeholder="Problem description"
                className={`textarea textarea-bordered w-full h-28 rounded-xl ${errors.description ? 'textarea-error' : ''}`}
              />
              {errors.description && <p className="text-error mt-1">{errors.description.message}</p>}
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="form-control w-full">
                <label className="label">Difficulty:</label><br /><br />
                <select
                  {...register('difficulty')}
                  className="select select-bordered w-full rounded-xl"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="form-control w-full">
                <label className="label">Tag:</label><br /><br />
                <select
                  {...register('tags')}
                  className="select select-bordered w-full rounded-xl"
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    {...register('isBugInjection')}
                    className="checkbox checkbox-primary"
                  />
                  <span className="label-text font-semibold">
                    Bug Injection Mode (Starter code contains bugs)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Visible Test Cases */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Visible Test Cases</h2>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => appendVisible({ input: '', output: '', explanation: '' })}>
                + Add
              </button>
            </div>
            {visibleFields.map((field, index) => (
              <div key={field.id} className="bg-base-300 p-4 rounded-xl space-y-3">
                <div className="flex justify-end">
                  <button type="button" className="btn btn-xs btn-error" onClick={() => removeVisible(index)}>Remove</button>
                </div>
                <input {...register(`visibleTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full" />
                <input {...register(`visibleTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full" />
                <textarea {...register(`visibleTestCases.${index}.explanation`)} placeholder="Explanation" className="textarea textarea-bordered w-full" />
              </div>
            ))}
          </div>

          {/* Hidden Test Cases */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Hidden Test Cases</h2>
              <button type="button" className="btn btn-sm btn-primary" onClick={() => appendHidden({ input: '', output: '' })}>
                + Add
              </button>
            </div>
            {hiddenFields.map((field, index) => (
              <div key={field.id} className="bg-base-300 p-4 rounded-xl space-y-3">
                <div className="flex justify-end">
                  <button type="button" className="btn btn-xs btn-error" onClick={() => removeHidden(index)}>Remove</button>
                </div>
                <input {...register(`hiddenTestCases.${index}.input`)} placeholder="Input" className="input input-bordered w-full" />
                <input {...register(`hiddenTestCases.${index}.output`)} placeholder="Output" className="input input-bordered w-full" />
              </div>
            ))}
          </div>

          {/* Code Templates */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Code Templates</h2>
            {[0, 1, 2].map((index) => (
              <div key={index} className="space-y-4">
                <h3 className="font-medium text-lg">
                  {index === 0 ? 'C++' : index === 1 ? 'Java' : 'JavaScript'}
                </h3>

                <div className="form-control">
                  <label className="label">Initial Code</label>
                  <textarea
                    {...register(`startCode.${index}.initialCode`)}
                    className="textarea textarea-bordered font-mono w-full h-32 bg-base-100 rounded-xl"
                    placeholder="Starter code"
                  />
                </div>

                <div className="form-control">
                  <label className="label">Reference Solution</label>
                  <textarea
                    {...register(`referenceSolution.${index}.completeCode`)}
                    className="textarea textarea-bordered font-mono w-full h-32 bg-base-100 rounded-xl"
                    placeholder="Reference solution"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button type="submit" className="btn btn-primary w-full text-lg rounded-xl">
              Create Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;

import Terminal from 'vite-plugin-terminal'

export default {
  plugins: [
    Terminal({
      console: 'terminal',
      output: ['terminal', 'console']
    })
  ]
}
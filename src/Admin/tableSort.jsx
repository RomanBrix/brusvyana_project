export function changeSortRule({target}, setSortRule, sortRule){
    const {name, type} = target.dataset
    // console.log(sortRule.name, name)
    if(name === sortRule.name){
        setSortRule({
            name,
            order: sortRule.order === 'asc' ? 'desc' : 'asc',
            type
        })
    }else{
        setSortRule({
            name,
            order: 'asc',
            type
        })

    }
    // console.log(target.dataset);
}

export function renderArrow(name, sortRule){
    if(sortRule.name === name){
        if(sortRule.order === 'asc'){
            return <span>&#9650;</span>
        }else{
            return <span>&#9660;</span>
        }
    }
}


export function sortFunction(a,b, sortRule){
    switch(sortRule.type){
        case 'string':
            if(sortRule.order === 'asc'){
                return a[sortRule.name].localeCompare(b[sortRule.name])
            }
            return b[sortRule.name].localeCompare(a[sortRule.name])
        case 'boolean':
            if(sortRule.order === 'asc'){
                return a[sortRule.name] - b[sortRule.name]
            }
            return b[sortRule.name] - a[sortRule.name]
        case 'date':
            if(sortRule.order === 'asc'){
                return new Date(a[sortRule.name]) - new Date(b[sortRule.name])
            }
            return new Date(b[sortRule.name]) - new Date(a[sortRule.name])
        case 'number':
            if(sortRule.order === 'asc'){
                return a[sortRule.name] - b[sortRule.name]
            }
            return b[sortRule.name] - a[sortRule.name]
            
        default:
            return 0
        }
}